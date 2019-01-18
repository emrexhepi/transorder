import * as actionTypes from './actionTypes';

// //////////////////////////////////////////////////
// Helpers

// returns settings from database
function getSettingsFromDB(settingName, db) {
    const settings = db.get('settings').find({
        name: settingName,
    }).value().data;

    return settings;
}

// array to object with ids
function arrayToObject(arr, defaults = {}) {
    // flatten array
    const obj = arr.reduce((accumualtor, item, index) => {
        // create new object
        // if item does not have id set index as key
        const key = item.id || index;
        const newObj = {};
        newObj[key] = item;

        // assign defaults
        newObj[key] = Object.assign(newObj[key], defaults);

        // assign newObj to accumulator and return it
        return Object.assign(accumualtor, newObj);
    }, {});
    return obj;
}

// ##################################################
// //////////////////////////////////////////////////

// //////////////////////////////////////////////////
// General Actions

// load streams from db to redux store
export const loadStreamsToStore = (store, db) => {
    const streams = db.get('streams').value();

    // stream defaults
    const streamDefaults = {
        recording: false,
        recorders: {},
        error: '',
        recordingLogs: {},
    };

    const objStreams = arrayToObject(streams, streamDefaults);

    store.dispatch({
        type: actionTypes.STORE_STREAMS,
        payload: objStreams,
    });
};

// load ffmpeg settings from db to redux store
export const loadRecorderSettingsToStore = (store, db) => {
    const settings = getSettingsFromDB('recorder', db);

    store.dispatch({
        type: actionTypes.STORE_RECORDER_SETTINGS,
        payload: settings,
    });
};

// load shceduler settings from db to redux store
export const loadSchedulerSettingsToStore = (store, db) => {
    const settings = getSettingsFromDB('scheduler', db);

    store.dispatch({
        type: actionTypes.STORE_SCHEDULER_SETTINGS,
        payload: settings,
    });
};

// set stream error
export const setStreamError = (store, streamID, errorMessage, record) => {
    store.dispatch({
        type: actionTypes.SET_STREAM_ERROR,
        streamID,
        record,
        payload: errorMessage,
    });
};


// //////////////////////////////////////////////////
// Recorder Actions

export const setRecorderToStream = (store, streamID, recorderID, payload) => {
    store.dispatch({
        type: actionTypes.SET_RECORDER_TO_STREAM,
        streamID,
        recorderID,
        payload,
    });
    console.log('Set Recroder: ');
    console.log(streamID, recorderID, payload);
};

export default null;
