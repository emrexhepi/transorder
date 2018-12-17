
// import libs
// import Scheduler from './lib/Scheduler';

// redux imports
import { loadStreamsToStore, loadFfmpegSettingsToStore, loadSchedulerSettingsToStore } from './redux/actions/transcoder';
import store from './redux/store';

class Transcorder {
    unsubscribeStore = () => {}
    schedulers = [];
    db = null;
    store = null;

    constructor(db) {
        // set db as object property
        this.db = db;

        // set store as object property
        this.store = store;

        // Start Transcoding
        this.init();
    }
    
    init() {
        console.log('Transcoding is initiated!\n');

        // subscribe to redux store to log actions
        this.unsubscribeStore = this.store.subscribe(() => {
            console.log(store.getState());
        });
        
        // load streams in to redux store
        loadStreamsToStore(store, this.db);

        // load ffmpeg settings in to redux store
        loadFfmpegSettingsToStore(store, this.db);

        // load scheduler settings in to redux store
        loadSchedulerSettingsToStore(store, this.db);

        // asign schedulers to streams

        /*

        // Create scheulders from streams
        streams.forEach((stream) => {
            const scheduler = new Scheduler(stream, schedulerSettings, ffmpegSettings);
            
            this.schedulers.push({
                name: stream.name,
                scheduler,
                stream,
            });
        });

        console.log('[Transcorder.js].init()-> schedulers no:', this.schedulers.length);
        
        */
    }
}

export default Transcorder;

