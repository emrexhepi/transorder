// import packages
// import childProcess from 'child_process';
// import util from 'util';

import * as timeHelpers from './lib/timeHelpers';

class Transcorder {
    constructor(db) {
        // set init
        this.FFMPEGInstances = [];

        // set db as object property
        this.db = db;

        // initiate FFMPEG Manager

        // init functions
        this.loadSettingsFromDB();

        // Start Transcoding
        this.start();
    }

    start() {
        console.log('Transcoding started!\n');
    }

    // start recording schedule
    startRecScheduler() {
        // create FFMPEG Instance
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

    createFFMPEGInstance(channelName, ) {

    }
}

export default Transcorder;
