import { DateTime } from 'luxon';

class FFMPEG {
    constructor(settings) {
        this.settings = settings;
    }

    updateSettings(settings) {
        this.settings = settings;
    }

    // Start ffmpeg recording
    record() {
        console.log('FFMPEG - rec. started at: ', DateTime.local());
    }
    
    // stop ffmpeg recording instances
    stopRecord() {
        console.log('Stoping all recording instances');
    }
}

export default FFMPEG;
