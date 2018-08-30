import FFMPEG from './FFMPEGMan';

class Scheduler {
    constructor(stream, ffmpegSettings) {
        this.stream = stream;
        this.ffmpegSettings = ffmpegSettings;

        // start
        this.init();
    }

    init() {
        if (this.stream.record) {
            console.log(`\nScheduler_${this.stream.name} is initiated!`);

            const ffmpeg = new FFMPEG(this.stream, this.ffmpegSettings);

            ffmpeg.record();
        }
    }
}

export default Scheduler;
