// require libs
const Scheduler = require('./lib/Scheduler');

// redux require
const { 
    loadStreamsToStore, 
    loadRecorderSettingsToStore, 
    loadSchedulerSettingsToStore,
} = require('./redux/actions/transcoderActions');

// redux store selectors
const { getStreamsFromStore } = require('./redux/selectors/transcoderSelectors');

const store = require('./redux/store');

class Transcorder {
    constructor(db) {
        // set defaults
        this.schedulers = {};
        this.unsubscribeStore = () => (null)

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
        // this.unsubscribeStore = this.store.subscribe(() => {
        //     console.log(store.getState().lastAction);
        // });

        // this.unsubscribeStore();
        
        // load streams in to redux store
        loadStreamsToStore(store, this.db);

        // load recorder settings in to redux store
        loadRecorderSettingsToStore(store, this.db);

        // load scheduler settings in to redux store
        loadSchedulerSettingsToStore(store, this.db);

        // load scheulders
        this.loadSchedulers();
    }

    // create and load scheduler for each stream
    loadSchedulers() {
        // get streams form redux store
        const streams = getStreamsFromStore(this.store, 'streams');

        // iterate through streams and create schedulers for each stream
        Object.keys(streams).forEach(
            (key) => {
                // console.log(streams[key]);
                const stream = streams[key];
                const scheduler = new Scheduler(this.store, stream.id);
                this.schedulers[stream.id] = scheduler;
            },
        );
    }
}

module.exports = Transcorder;

