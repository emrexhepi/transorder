// import packages
import Scheduler from './lib/Scheduler';

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

        // INITIATE Schedulers

        // get streams
        const streams = this.getStreams();

        // get ffmpegSettings
        const ffmpegSettings = this.getSettingsFromDB('ffmpeg');

        // get scheduler settings
        const schedulerSettings = this.getSettingsFromDB('scheduler');

        // Create scheulders from streams
        streams.forEach((stream) => {
            const scheduler = new Scheduler(stream, schedulerSettings, ffmpegSettings);
            
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
    getSettingsFromDB(settingName) {
        const settings = this.db.get('settings').find({
            name: settingName,
        }).value().data;

        return settings;
    }
}

export default Transcorder;
