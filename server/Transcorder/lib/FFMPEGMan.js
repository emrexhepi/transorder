// import childProcess from 'child_process';
// import util from 'util';

import { DateTime } from 'luxon';
import * as timeHelpers from './timeHelpers';

class FFMPEG {
    constructor(stream, settings) {
        this.stream = stream;
        this.settings = settings;
    }

    updateSettings(settings) {
        this.settings = settings;
    }

    // Start ffmpeg recording
    record(recProps) {
        console.log('\x1b[32m%s\x1b[0m', `[FMPEGMan.js] - record() ${this.stream.name} at ${DateTime.local().toISOTime()}`);
        console.log('with props: ', recProps);

        // set timeout to finish record job
        setTimeout(
            this.finish,
            timeHelpers.secondsToMilliseconds(recProps.duration),
        );
    }

    finish() {
        // log finish time
        console.log('\x1b[36m%s\x1b[0m', `[FMPEGMan.js].finish() - Record finished at ${DateTime.local().toISOTime()}`);
    }
    
    // stop ffmpeg recording instances
    stopRecord() {
        console.log('[FFMPEGMan.js].stopRecord() - stoping all record instances!');
    }
}

export default FFMPEG;
