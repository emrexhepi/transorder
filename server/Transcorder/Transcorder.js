// import packages
// import childProcess from 'child_process';
// import util from 'util';

import * as timeHelpers from './lib/timeHelpers';

class Transcorder {
    constructor(db) {
        // set db as object property
        this.db = db;

        // init functions
        this.loadSettingsFromDB();

        // Start Transcoding
        this.start();
    }

    start() {
        console.log('Transcoding started!\n');
    }

    // Start ffmpeg recording
    record() {
        console.log('FFMPEG Recording starts!');
    }

    // stop ffmpeg recording instances
    stopRecord() {
        console.log('Stoping all recording instances');
    }

    // start recording schedule
    startRecScheduler() {
        const nextTimeSlot = timeHelpers.diffToNextTimeSlot(this.ffSettings.recordDuration);
        
        // call when next time slot
        setTimeout(() => {
            console.log('diffToNextTimeSlot:', nextTimeSlot, '\n');
            timeHelpers.diffToNextTimeSlot(this.ffSettings.recordDuration);
        }, timeHelpers.secondsToMilliseconds(nextTimeSlot));
    }

    loadSettingsFromDB() {
        // get ffmpeg settings from database
        this.ffSettings = this.db.get('settings')
            .filter({
                name: 'FFMPEG',
            })
            .value()[0].data;
    }
}

export default Transcorder;
