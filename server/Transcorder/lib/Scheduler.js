// import FFMPEG from './FFMPEGMan';
import * as timeHelpers from './timeHelpers';

class Scheduler {
    constructor(stream, schedulerSettings, ffmpegSettings) {
        this.stream = stream;
        this.settings = schedulerSettings;
        this.ffmpegSettings = ffmpegSettings;

        // initiate
        console.log(`\nScheduler_${this.stream.name} is initiated!`);
        if (this.stream.schedul.record) {
            this.startSchedule();
        }
    }

    startSchedule() {
        console.log(`Scheduler_${this.stream.name} is starting schedule`);
        
        // get next time slot
        const diffToNextTimeSlot =
            timeHelpers.diffToNextTimeSlotInSec(this.stream.schedul.duration);
        
        setTimeout(this.scheduleRecord, timeHelpers.secondsToMilliseconds(diffToNextTimeSlot));
    }

    scheduleRecord() {
        console.log('Scheduler star1ting FFMPEG Record!');
    }
}

export default Scheduler;
