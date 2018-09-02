// import FFMPEG from './FFMPEGMan';
import * as timeHelpers from './timeHelpers';
import FFMPEG from './FFMPEGMan';

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
            
            // test stop schedule and record
            setTimeout(this.stopSchedule, 60000);

            // restart schedule
            setTimeout(this.initSchedule, 120000);
        }
    }

    initSchedule = () => {
        console.log(`Scheduler_${this.stream.name} is initiating!`);
        
        // schedule next record
        this.scheduleRecord();
    }

    scheduleRecord = () => {
        console.log('[schduler.js] - scheduleRecord() ===============================');

        // if recording is not enabled return null
        if (!this.stream.schedule.record) {
            return;
        }

        // start recording
        this.record();

        // get next time slot
        const diffToNextTimeSlot =
            timeHelpers.diffToNextTimeSlotInSec(this.stream.schedule.duration);

        console.log(
            '[schduler.js] scheduleRecord() - scheduling :',
            timeHelpers.convertTodaySecondsToDateTime(
                timeHelpers.nextDayTimeSlotInSec(
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

    record() {
        // call record on ffmpeg
        this.FFMPEG.record();
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
