// import FFMPEG from './FFMPEGMan';
import { DateTime } from 'luxon';
import * as timeHelpers from './timeHelpers';
import FFMPEG from './FFMPEGMan';

class Scheduler {
    instances = [];

    constructor(stream, schedulerSettings, ffmpegSettings) {
        this.stream = stream;
        this.settings = schedulerSettings;
        this.FFMPEGSettings = ffmpegSettings;
        this.timeOutID = null;
        this.addedPreDurationSecs = 0;

        // initiate
        console.log(`\nScheduler_${this.stream.name} is initiated!`);
        if (this.stream.record) {
            this.initSchedule();
        }
    }

    initSchedule = () => {
        console.log(`Scheduler_${this.stream.name} is initiating!`);
        
        // schedule next record
        this.scheduleRecord();
    }

    // returns ffmpegInstance or undefined
    findInstance(id = null) {
        if (!id) throw Error('id not set');

        if (!this.instances.length === 0) return undefined;

        const instance = this.instances.find(
            inst => inst.name === id,
        );

        return instance;
    }
    
    createInstance() {
        // generate intsance name
        const id = `_${Math.random().toString(36).substr(2, 10)}`;
        // generate new instance
        const ffmpeg = new FFMPEG(id, this.stream, this.FFMPEGSettings);
        // create recInstance
        const recInstance = {
            id,
            ffmpeg,
        };

        // push it to instances and return it
        this.instances.push(recInstance);

        return recInstance;
    }

    getInstance(id = null) {
        // if id find on instances
        if (id) {
            return this.findInstance(id);
        }
        // if id is null create new one
        return this.createInstance();
    }

    scheduleRecord = (instanceId = null) => {
        // get instance
        const recInstance = this.getInstance(instanceId);

        console.log('\n\n[schduler.js] - scheduleRecord() ===============================');
        console.log(`Started at: ${DateTime.local().toISOTime()}`);
        // if recording is not enabled return null
        if (!this.stream.record) {
            return;
        }

        // setting checks
        // check preDurationSecs
        if (this.settings.preDurationSecs > this.stream.recDuration) {
            throw Error('Error: Scheduler settings preDurationSecs is greater then stream duration!');
        }

        // check skipSecs
        if (this.settings.skipSecs > this.settings.preDurationSecs + this.stream.recDuration) {
            throw Error('Error: Scheduler settings skipSecs is greater then stream duration + scheduler preDurationSecs!');
        }

        // check stream record duration should be greater then 5secs
        if (this.stream.recDuration < 5) {
            throw Error('Error: Stream record duration should be greater then 5!');
        }

        // init properties
        const diffToNextTimeSlot =
            timeHelpers.diffToNextTimeSlotInSec(
                this.stream.recDuration,
                this.addedPreDurationSecs,
            );

        let { preDurationSecs, skipSecs } = this.settings;
        const { afterDurationSecs } = this.settings;

        console.log('diffToNextTimeSlot: ', diffToNextTimeSlot);
        let nextInterval = diffToNextTimeSlot - preDurationSecs;
        
        if (nextInterval < 5) {
            nextInterval = diffToNextTimeSlot;
            preDurationSecs = 0;
            skipSecs = 0;
        }
        console.log('Next interval In: ', nextInterval);

        // calculate record duration
        const recrodDuration =
            nextInterval +
            preDurationSecs +
            afterDurationSecs;

        // estimated end DateTime
        const estimatedEndDateTime =
            timeHelpers.convertSecondsToDateTime(
                timeHelpers.convertDateTimeToSeconds(DateTime.local()) +
                recrodDuration,
            );

        // calculate time
        const recProps = {
            skipSecs,
            duration: recrodDuration,
            startTime: timeHelpers.convertSecondsToDateTime(
                timeHelpers.currentTimeSlotInSec(this.stream.recDuration),
            ),
            estimatedEndDateTime,
        };

        // start recording
        this.record(recInstance, recProps);

        // scheudle timout
        setTimeout(
            this.scheduleRecord,
            nextInterval * 1000,
        );

        // set added preduraion
        this.addedPreDurationSecs = preDurationSecs;
    }

    record(recInstance, recProps) {
        const { ffmpeg } = recInstance;

        // set error and sucess hooks
        ffmpeg.onFinish((ffmpegMan) => {
            console.log(`[Schedule.js].record -> ${ffmpegMan.processID} finished recording`);
        });

        ffmpeg.onError((error, ffmpegMan) => {
            console.log(`[Schedule.js].record -> ${ffmpegMan.processID} ended with ERROR!`);
            console.log(error.message);
        });

        // call record on ffmpeg
        ffmpeg.record(recProps);
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
