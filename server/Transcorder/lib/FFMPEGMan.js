// import childProcess from 'child_process';
// import util from 'util';

import { DateTime } from 'luxon';

class FFMPEG {
    constructor(stream, settings) {
        this.stream = stream;
        this.settings = settings;
    }

    updateSettings(settings) {
        this.settings = settings;
    }

    // Start ffmpeg recording
    record() {
        console.log(`[FMPEGMan.js] - record() ${this.stream.name} at ${DateTime.local().toISOTime()}`);
    }
    
    // stop ffmpeg recording instances
    stopRecord() {
        console.log('[FFMPEGMan.js].stopRecord() - stoping all record instances!');
    }
}

export default FFMPEG;
