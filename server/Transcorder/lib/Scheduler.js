/* eslint-disable consistent-return */
// import libraries
import fs from 'fs';
// eslint-disable-next-line no-unused-vars
import { DateTime } from 'luxon';
import * as timeHelpers from './timeHelpers';
import * as schedHelpers from './schedulerHelpers';
import { makeRandomID } from './helpers';

// import Recorder ( ffmpeg wrapper)
import Recorder from './Recorder';

// redux selectors
import { 
    getStreamFromStore,
    getSchedSettingsFromStore,
} from '../redux/selectors/transcoderSelectors';
import { setStreamError } from '../redux/actions/transcoderActions';

class Scheduler {
    instances = {};
    store = null;
    streamID = '';
    stream = {};
    settigns = {};
    schedTimeOut = null;

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
    }

    // get stream and settings from store and set them as attributes
    updateStreamAndSettings() {
        // get stream from store
        this.stream = getStreamFromStore(this.store, this.streamID);

        // get scheduler settings from store
        this.settings = getSchedSettingsFromStore(this.store);
    }

    // eslint-disable-next-line no-unused-vars
    scheduleRecord = () => {
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
            console.log('Recording stoped for:', this.stream.id);
            console.log('Error:', e.message);
            return null;
        }

        // difference to next time slot
        const diffToNextTimeSlot = timeHelpers.diffToNextTimeSlotInSec(
                this.stream.recDuration,
                this.settings.beforeTimeSlotSecs,
        );

        console.log(diffToNextTimeSlot);
        

        // if differenct to next interval is smaller then
        // do not start record
        if (diffToNextTimeSlot < this.settings.minDuration) {
            console.log(`Waiting next time slot in les then ${this.settings.minDuration}`);
            console.log(`Waiting next time slot in les then ${this.settings.minDuration}`);
            // Schedule Another Record
            setTimeout(this.scheduleRecord, diffToNextTimeSlot * 1000);
            return null;
        }

        // calculate record duration
        const recordDuration = 
            Math.round(
                diffToNextTimeSlot + 
                this.settings.beforeTimeSlotSecs + 
                this.settings.afterTimeSlotSecs,
            );
            
        // ####### Sart Record
        this.record(recordDuration);

        // Schedule Next Record
        setTimeout(this.scheduleRecord, diffToNextTimeSlot * 1000);
    }

    record(recordDuration, id = null) {
        // get instance
        const recorder = this.getInstance(id);

        // start recording
        recorder.start(recordDuration, this.settings.skipFirstSecs);
    }

    // returns an existing or new instance
    getInstance(id = null) {
        let instance = null;

        // if id find on instances
        if (id !== null) {
            instance = this.findInstance(id);
            this.addInstance(instance);
        }

        // if instance not found create new one
        if (instance === null) {
            instance = this.createInstance();
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
        // console.log(`[Schedule.js].record -> ${instanceID} finished recording`);
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
                // console.log(err);
            });
        }

        if (instance && instance.ffmpeg) {
            instance.ffmpeg.stopRecord(true);
        }

        this.removeInstance(instanceID);
    }

    // on record error
    onError = (instanceID) => {
        // console.log(`[Schedule.js].record -> ${instanceID} recording ERROR`);

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
