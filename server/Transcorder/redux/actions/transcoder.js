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

// //////////////////////////////////////////////////

// load streams from db to redux store
export const loadStreamsToStore = (store, db) => {
    const streams = db.get('streams').value();

    store.dispatch({
        type: actionTypes.STORE_STREAMS,
        payload: streams,
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
