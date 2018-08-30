// import packages
import Scheduler from "./lib/Scheduler";

class Transcorder {
    constructor(db) {
        // set init
        this.schedulers = [];

        // set db as object property
        this.db = db;

        // Start Transcoding
        this.init();
    }

    init() {
        console.log('Transcoding is initiated!\n');

        // Initiate scheduler for every stream

        // get streams
        const streams = this.getStreams();

        // get ffmpegSettings
        const ffmpegSettings = this.getFFMPEGSettings();

        // Create scheulders from streams
        streams.forEach((stream) => {
            const scheduler = new Scheduler(stream, ffmpegSettings);
            
            this.schedulers.push({
                name: stream.name,
                scheduler,
            });
        });

        // console.log(this.schedules);
    }

    // gets streams from database
    getStreams() {
        const streams = this.db.get('streams').value();
        return streams;
    }

    // returns ffmpeg settings from database
    getFFMPEGSettings() {
        const ffmpegSettings = this.db.get('settings').find({
            name: 'FFMPEG',
        }).value();

        return ffmpegSettings;
    }
}

export default Transcorder;
