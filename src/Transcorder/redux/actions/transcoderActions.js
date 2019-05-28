const actionTypes = require('./actionTypes');

// //////////////////////////////////////////////////
// Helpers

// returns settings from database
function getSettingsFromDB(settingName, db) {
    const settings = db.get('settings').find({
        name: settingName,
    }).value().data;

    return settings;
}
exports.getSettingsFromDB = getSettingsFromDB;

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
exports.arrayToObject = arrayToObject;

// ##################################################
// //////////////////////////////////////////////////

// //////////////////////////////////////////////////
// General Actions

// load streams from db to redux store
const loadStreamsToStore = (store, db) => {
    const streams = db.get('streams').value();

    // stream defaults
    const streamDefaults = {
        recording: false,
        recorders: {},
        error: '',
    };

    const objStreams = arrayToObject(streams, streamDefaults);

    store.dispatch({
        type: actionTypes.STORE_STREAMS,
        payload: objStreams,
    });
};
exports.loadStreamsToStore = loadStreamsToStore;

// load ffmpeg settings from db to redux store
const loadRecorderSettingsToStore = (store, db) => {
    const settings = getSettingsFromDB('recorder', db);

    store.dispatch({
        type: actionTypes.STORE_RECORDER_SETTINGS,
        payload: settings,
    });
};
exports.loadRecorderSettingsToStore = loadRecorderSettingsToStore;

// load shceduler settings from db to redux store
const loadSchedulerSettingsToStore = (store, db) => {
    const settings = getSettingsFromDB('scheduler', db);

    store.dispatch({
        type: actionTypes.STORE_SCHEDULER_SETTINGS,
        payload: settings,
    });
};
exports.loadSchedulerSettingsToStore = loadSchedulerSettingsToStore;

// set stream error
const setStreamError = (store, streamID, errorMessage, record) => {
    store.dispatch({
        type: actionTypes.SET_STREAM_ERROR,
        streamID,
        record,
        payload: errorMessage,
    });
};
exports.setStreamError = setStreamError;


// //////////////////////////////////////////////////
// Recorder Actions

const setRecorderToStore = (store, payload) => {
    store.dispatch({
        type: actionTypes.SET_RECORDER,
        payload,
    });
};
exports.setRecorderToStore = setRecorderToStore;

const updateRecorderToStore = (store, payload) => {
    store.dispatch({
        type: actionTypes.UPDATE_RECORDER,
        payload,
    });
};
exports.updateRecorderToStore = updateRecorderToStore;

const pushLogToRecorder = (store, ID, payload) => {
    store.dispatch({
        type: actionTypes.PUSH_LOG_TO_RECORDER,
        ID,
        payload,
    });
};
exports.pushLogToRecorder = pushLogToRecorder;

const updateRecorderFields = (store, ID, payload) => {
    store.dispatch({
        type: actionTypes.UPDATE_RECORDER_FIELD,
        ID,
        payload,
    });
};
exports.updateRecorderFields = updateRecorderFields;

const removeRecorderFromStore = (store, ID) => {
    store.dispatch({
        type: actionTypes.REMOVE_RECORDER,
        payload: {
            ID,
        },
    });
};
exports.removeRecorderFromStore = removeRecorderFromStore;
