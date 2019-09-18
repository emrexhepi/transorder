/* eslint-disable consistent-return */
// import libraries
import fs from 'fs';
// eslint-disable-next-line no-unused-vars
import { DateTime } from 'luxon';
import * as timeHelpers from './timeHelpers';
import * as schedHelpers from './schedulerHelpers';
import { makeRandomID, getMediaInfo, saveJsonObjToFile } from './helpers';

// import Recorder ( ffmpeg wrapper)
import Recorder from './Recorder';

// redux imports
import * as actionTypes from '../redux/actions/actionTypes';
import { 
    getStreamFromStore,
    getSchedSettingsFromStore,
    getRecorderFromStore,
} from '../redux/selectors/transcoderSelectors';
import { 
    setStreamError,
    setRecorderToStore,
    removeRecorderFromStore,
    updateRecorderToStore,
    pushLogToRecorder,
} from '../redux/actions/transcoderActions';

class Scheduler {
    instances = {};
    store = null;
    streamID = '';
    stream = {};
    settings = {};
    schedTimeOut = null;
    unsubscribeStore = null;

    constructor(store, streamID) {
        // set parametters to obj attributes
        this.store = store;
        this.streamID = streamID;

        // update stream and settings
        this.updateStreamAndSettings();
        
        // initiate
        if (this.stream.record) {
            this.scheduleRecord();
        }

        // subscribe to stores last action
        this.unsubscribeStore = this.store.subscribe(() => {
            // if action type FINISHED_RECORD call handle
            if (store.getState().lastAction.type === actionTypes.FINISHED_RECORD) {
                this.handleFinishRecords(store.getState().lastAction);
            }
        });
    }

    
    // get stream and settings from store and set them as attributes
    updateStreamAndSettings() {
        // get stream from store
        this.stream = getStreamFromStore(this.store, this.streamID);

        // get scheduler settings from store
        this.settings = getSchedSettingsFromStore(this.store);
    }

    // check for finished records
    async handleFinishRecords(action) {
        // var init
        let restartRecord = false;
        let log = {};

        // check if instance is from this scheduler elser return null
        if (typeof this.instances[action.recorderID] === 'undefined') return null;
        
        // get recorder from store
        const recorderInfo = getRecorderFromStore(this.store, action.recorderID);

        // console.log(recorderInfo);
        // get file info
        const { fileExists, corrupted, duration } = await getMediaInfo(action.path.outputPath);

        log = {
            filePath: action.path.outputPath,
            fileExists,
            corrupted,
            duration,
            errors: [],
        };

        // restart record checks
        if (!fileExists) {
            log.errors.push('File does not exist!');
            restartRecord = true;
        }
        
        if (corrupted) {
            log.errors.push('File corrupted!');
            restartRecord = true;
        }

        // if file duration is less then record duration
        if (duration !== 0 && duration < recorderInfo.recordDuration) {
            log.errors.push('Duration is smaller then set, record stoped without corruption before finish!');
            restartRecord = true;
        }

        // if payload has error
        // push error to log
        if (action.payload.error) {
            log.errors.push(action.payload.error.message);
        }

        // push log to redux store
        pushLogToRecorder(this.store, action.recorderID, log);

        // restart record
        if (restartRecord) {
            // restart recording
            setTimeout(() => {
                console.log('RESTARTING RECORD!!!!!');
                this.scheduleRecord(action.recorderID, recorderInfo.schedule.currentTS);
            }, this.settings.reScheduleTimeout * 1000);

            return;
        }

        // do not restart & clean
        this.clearRecorder(action.recorderID);
    }

    clearRecorder(id, forceSaveLog = false) {
        console.log('Clearing Record!');
        const recorderInfo = getRecorderFromStore(this.store, id);
        const recorderInstance = this.instances[id];

        // save logs
        if (recorderInfo.fileLogs.length > 1 || forceSaveLog) {
            saveJsonObjToFile(recorderInfo.fileLogs, `${recorderInfo.basePath.outputPath}.json`);
        }

        // clear the recorder
        recorderInstance.cleanExit();

        // delete recorder from store
        removeRecorderFromStore(this.store, id);

        // release recorder from scheduler
        delete this.instances[id];
    }

    // eslint-disable-next-line no-unused-vars
    scheduleRecord = (id = null, fromTimeSlot = null) => {
        // console.log('START SCHEDULE=============================');
        // update stream and settings
        this.updateStreamAndSettings();

        // if recording is not enabled return null
        if (!this.stream.record) {
            return null;
        }

        // check settings before record start
        // if error save message to stream in redux store and return null;
        try {
            schedHelpers.checkSettings(this.settings, this.stream);
        } catch (e) {
            // push error to store in aprroperiate stream and disable recording
            setStreamError(this.store, this.streamID, e.message, false);
            // console.log('Recording stoped for:', this.stream.id);
            // console.log('Error:', e.message);
            return null;
        }

        // next schedule
        const nextSchedule = timeHelpers.schedToNextTimeSlot(
            this.stream.recDuration, fromTimeSlot,
        );
        
        // difference to next time slot
        const diffToNextTimeSlot = nextSchedule.diffToNextTSSec;

        // console.log(diffToNextTimeSlot);
        // console.log('current time:\t\t', timeHelpers.currentDayTime().toRFC2822());
        // console.log('current TimeSLOT:\t', nextSchedule.currentTS.toRFC2822());
        // console.log('next TimeSLOT:\t\t', nextSchedule.nextTS.toRFC2822());
        // console.log('diffto TimeSLOT:\t\t', diffToNextTimeSlot);
        
        // start recording
        let $skipFirstSecs = this.settings.skipFirstSecs;
        // if there is an ID means first try did not record succesfully
        // or the calculated record duration is not ~equal to record duration
        // or skipfirst secs more the duration
        // then there is no need to skip seconds
        if (
            id !== null 
            ) {
                $skipFirstSecs = 0;
        }

        // calculate record duration
        const recordDuration = 
            Math.round(
                (diffToNextTimeSlot +
                this.settings.afterTimeSlotSecs) -
                $skipFirstSecs,
            );
        // console.log('recordDuration: ', recordDuration);
        
        // if differenct to next interval is smaller then
        // minimum allowed or skipfirst seconds
        // do not start record
        if (
            recordDuration < this.settings.minDuration
           ) {
            // if next to time slot is les then minimum duration
            if (diffToNextTimeSlot < this.settings.minDuration) {
                // console.log(
                //     'Diff to next timeslot is smaller then minDuration:',
                //     this.settings.minDuration,
                // );
            }

            // if next to time slot is les then skip first seconds
            if (diffToNextTimeSlot < this.settings.skipFirstSecs) {
                // console.log(
                //     'Diff to next timeslot is smaller the skipFirstSecs:',
                //     this.settings.skipFirstSecs,
                // );
            }

            // Schedule Another Record
            const nextCleanSchedule = timeHelpers.secondsToMilliseconds(diffToNextTimeSlot);
            // console.log(`Waiting next time slot in les then ${nextCleanSchedule}`);

            // process.exit();
            if (!id) {
                setTimeout(() => {
                    this.scheduleRecord(null, nextSchedule.nextTS);
                }, nextCleanSchedule);
            }

            // if id and no more time
            // clear recorder
            if (id) {
                this.clearRecorder(id, true);
            }
            return null;
        }
        
        // get recording instance
        const recorder = this.getInstance(id);
        
        // Schedule next record
        const nextScheduleSecs = diffToNextTimeSlot - this.settings.skipFirstSecs;
        // console.log(
        //     'next record starts at: ',
        //     DateTime.local().plus({ seconds: nextScheduleSecs }).toRFC2822(),
        // );
        
        // ####### Schedule Next Record
        if (!id) {
            setTimeout(() => {
                this.scheduleRecord(null, nextSchedule.nextTS);
            }, nextScheduleSecs * 1000);

            // set new recorder to store
            setRecorderToStore(
                this.store,
                {
                    streamID: this.streamID,
                    ID: recorder.ID,
                    recordDuration,
                    schedule: nextSchedule,
                    basePath: null,
                },
            );
        }

        // update recorder if exists
        if (id) {
            updateRecorderToStore(
                this.store,
                {
                    ID: recorder.ID,
                    recordDuration,
                    schedule: nextSchedule,
                },
            );
        }

        // ####### Sart Record
        recorder.start(recordDuration, $skipFirstSecs);

        // console.log('END SCHEDULE=============================');
    }

    // returns an existing or new instance
    getInstance(id = null) {
        let instance = null;

        // if id find on instances
        if (id) {
            instance = this.findInstance(id);
        }

        // if instance not found create new one
        if (!instance) {
            instance = this.createInstance();
            this.addInstance(instance);
        }

        // if id is null create new one
        return instance;
    }

    // returns ffmpegInstance or undefined
    findInstance(id = null) {
        if (!id) throw Error('id not set');

        if (!this.instances.length === 0) return undefined;

        // if key in object exists return value
        if (Object.prototype.hasOwnProperty.call(this.instances, id)) {
            return this.instances[id];
        }

        return undefined;
    }

    // creates a new recorder instance and returns it
    createInstance() {
        // generate random intsance id
        const ID = `${this.streamID}_${makeRandomID()}`;

        // generate new instance
        const recorder = new Recorder(this.store, this.streamID, ID);

        // return recorder
        return recorder;
    }

    // adss instance to the instances object
    addInstance(recInstance) {
        this.instances[recInstance.ID] = recInstance;
    }

    // removes instance from the instance object
    removeInstance(ID) {
        delete this.instances[ID];
    }

    // on record success
    onSuccess = (instanceID) => {
        // get instance by id
        const instance = this.getInstance(instanceID);

        // if there are more then one file per timeslot
        // write a json
        if (instance && instance.files.length > 0) {
            instance.files.push({
                outputPath: instance.ffmpeg.outputPath,
                outputDirectory: instance.ffmpeg.outputDirectory,
                outputFileName: instance.ffmpeg.outputFileName,
            });

            const content = JSON.stringify(instance.files);

            const jsonFileName = `${instance.files[0].outputDirectory}\\${instance.files[0].outputFileName}.json`;

            // write information to json
            fs.writeFile(jsonFileName, content, 'utf8', (err) => {
                if (err) {
                    throw err;
                }
            });
        }

        if (instance && instance.ffmpeg) {
            instance.ffmpeg.stopRecord(true);
        }

        this.removeInstance(instanceID);
    }

    // on record error
    onError = (instanceID) => {
        // // console.log(`[Schedule.js].record -> ${instanceID} recording ERROR`);

        // reset hooks of instance
        const instance = this.getInstance(instanceID);
        instance.ffmpeg.resetHooks();

        instance.files.push({
            outputPath: instance.ffmpeg.outputPath,
            outputDirectory: instance.ffmpeg.outputDirectory,
            outputFileName: instance.ffmpeg.outputFileName,
        });

        setTimeout(() => {
            this.scheduleRecord(instanceID, false);
        }, this.settings.reScheduleTimeout * 1000);
    }

    stopSchedule = () => {
        // clear timer
        if (this.timeOutID) {
            clearTimeout(this.timeOutID);
            this.timeOutID = null;
        }

        // end ffmpeg
        throw Error('[Shcduler.js]->stopSchedule() UNIMPLEMENTED!');
    }
}

export default Scheduler;
