// import packages
// import childProcess from 'child_process';
// import util from 'util';

import * as timeHelpers from './lib/timeHelpers';

class Transcorder {
    constructor(db) {
        // set db as object property
        this.db = db;
        // get ffmpeg settings from database
        this.ffSettings = db.get('settings')
                            .filter({ name: 'FFMPEG' })
                            .value()[0].data;

        console.log(timeHelpers.getTimeInSeconds());

        // Start Transcoding
        this.start();
    }

    start() {
        console.log('Transcoding started!');
    }
}

export default Transcorder;
