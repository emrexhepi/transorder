// import FFMPEG from './FFMPEGMan';
import * as timeHelpers from './timeHelpers';

class Scheduler {
    constructor(stream, schedulerSettings, ffmpegSettings) {
        this.stream = stream;
        this.settings = schedulerSettings;
        this.ffmpegSettings = ffmpegSettings;

        // initiate
        console.log(`\nScheduler_${this.stream.name} is initiated!`);
        if (this.stream.schedule.record) {
            this.initSchedule();
        }
    }

    initSchedule() {
        console.log(`Scheduler_${this.stream.name} is initiating!`);
        
        // schedule next record
        this.scheduleRecord();
    }

    scheduleRecord = ()=> {
        console.log("[schduler.js] - scheduleRecord() ===============================");

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
            'Scheduling record for: \t\t',
            timeHelpers.convertTodaySecondsToDateTime(
                timeHelpers.nextDayTimeSlotInSec(
                    this.stream.schedule.duration,
                ),
            ).toISO(),
        );
        // schedule next record
        setTimeout(
            this.scheduleRecord,
            timeHelpers.secondsToMilliseconds(diffToNextTimeSlot),
        );
    }

    record() {
        console.log('Recording now: \t\t\t', timeHelpers.currentDayTime().toISO());
    }
}

export default Scheduler;
