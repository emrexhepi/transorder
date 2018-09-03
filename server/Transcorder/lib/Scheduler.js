// import FFMPEG from './FFMPEGMan';
import * as timeHelpers from './timeHelpers';
import FFMPEG from './FFMPEGMan';
import { exists } from 'fs';

class Scheduler {
    constructor(stream, schedulerSettings, ffmpegSettings) {
        this.stream = stream;
        this.settings = schedulerSettings;
        this.FFMPEG = new FFMPEG(stream, ffmpegSettings);
        this.timeOutID = null;

        // initiate
        console.log(`\nScheduler_${this.stream.name} is initiated!`);
        if (this.stream.schedule.record) {
            this.initSchedule();
        }
    }

    initSchedule = () => {
        console.log(`Scheduler_${this.stream.name} is initiating!`);
        
        // schedule next record
        this.scheduleRecord();
    }

    scheduleRecord = () => {
        console.log('\n\n[schduler.js] - scheduleRecord() ===============================');

        // if recording is not enabled return null
        if (!this.stream.schedule.record) {
            return;
        }

        // get next time slot
        const diffToNextTimeSlot =
            timeHelpers.diffToNextTimeSlotInSec(
                this.stream.schedule.duration,
                this.settings.preDurationSecs,
            );
        
        console.log('[schduler.js].scheduleRecord() -> diffToNextTimeSlot: ', diffToNextTimeSlot);
        
        // calculate preduration
        let preduration = this.settings.preDurationSecs < diffToNextTimeSlot ?
            this.settings.preDurationSecs :
            this.settings.preDurationSecs - diffToNextTimeSlot;
        
        console.log('preduration: ', preduration);
        
        setTimeout(this.scheduleRecord, 1000);
        return;

        // calculate record duration
        const recrodDuration = 
            preDuration +
            this.stream.schedule.duration +
            this.settings.afterDurationSecs;

        // calculate time
        const recProps = {
            skipSecs: this.settings.skipSecs,
            duration: recrodDuration,
        };

        // start recording
        this.record(recProps);


        console.log(
            '[schduler.js] scheduleRecord() - scheduling :',
            timeHelpers.convertTodaySecondsToDateTime(
                timeHelpers.nextTimeSlotInSec(
                    this.stream.schedule.duration,                    
                ),
            ).toISOTime(),
        );
        // schedule next record
        this.timeOutID = setTimeout(
            this.scheduleRecord,
            timeHelpers.secondsToMilliseconds(diffToNextTimeSlot),
        );
    }

    record(recProps) {
        // call record on ffmpeg
        this.FFMPEG.record(recProps);
    }

    stopSchedule = () => {
        // clear timer
        if (this.timeOutID) {
            clearTimeout(this.timeOutID);
            this.timeOutID = null;
        }

        this.FFMPEG.stopRecord();
    }
}

export default Scheduler;
