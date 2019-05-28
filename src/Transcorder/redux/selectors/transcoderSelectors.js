// returns all streams from redux store
function getStreamsFromStore(store) {
    const state = store.getState();

    return state.transcoder.streams;
}
exports.getStreamsFromStore = getStreamsFromStore;

// returns stream by id from store
function getStreamFromStore(store, streamID) {
    return getStreamsFromStore(store)[streamID];
}
exports.getStreamFromStore = getStreamFromStore;

// returns scheduler settings
function getSchedSettingsFromStore(store) {
    const state = store.getState();
    return state.transcoder.schedulerSettings;
}
exports.getSchedSettingsFromStore = getSchedSettingsFromStore;

// returns recorder settings
function getRecorderSettingsFromStore(store) {
    const state = store.getState();
    return state.transcoder.recorderSettings;
}
exports.getRecorderSettingsFromStore = getRecorderSettingsFromStore;

// ///////////////////////////////////////////////
// RECORDER SELECTORS

// returns recorder data from store
function getRecorderFromStore(store, recorderID) {
    const state = store.getState();

    if (state.transcoder.recorders[recorderID]) {
        return state.transcoder.recorders[recorderID];
    }

    return {};
}
exports.getRecorderFromStore = getRecorderFromStore;
