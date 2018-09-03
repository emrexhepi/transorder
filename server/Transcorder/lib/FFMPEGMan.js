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
        console.log(`[FMPEGMan.js] - record() ${this.stream.name} at ${DateTime.local().toISOTime()}`);
        console.log('with props: ', recProps);

        // testing
        this.startTime = DateTime.local();

        setTimeout(
            this.finish,
            timeHelpers.secondsToMilliseconds(recProps.duration),
        );
    }

    finish() {
        // log finish time
        console.log(`[FMPEGMan.js].finish() - Record finished at ${DateTime.local().toISOTime()}`);
    }
    
    // stop ffmpeg recording instances
    stopRecord() {
        console.log('[FFMPEGMan.js].stopRecord() - stoping all record instances!');
    }
}

export default FFMPEG;
