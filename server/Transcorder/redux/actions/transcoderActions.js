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
function arrayToObject(arr) {
    // flatten array
    const obj = arr.reduce((accumualtor, item, index) => {
        // create new object
        // if item does not have id set index as key
        const key = item.id || index;
        const newObj = {};
        newObj[key] = item;

        // assign newObj to accumulator and return it
        return Object.assign(accumualtor, newObj);
    }, {});
    return obj;
}

// ##################################################
// //////////////////////////////////////////////////

// load streams from db to redux store
export const loadStreamsToStore = (store, db) => {
    const streams = db.get('streams').value();

    const objStreams = arrayToObject(streams);

    store.dispatch({
        type: actionTypes.STORE_STREAMS,
        payload: objStreams,
    });
};

// load ffmpeg settings from db to redux store
export const loadFfmpegSettingsToStore = (store, db) => {
    const settings = getSettingsFromDB('ffmpeg', db);

    store.dispatch({
        type: actionTypes.STORE_FFMPEG_SETTINGS,
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

export default null;
