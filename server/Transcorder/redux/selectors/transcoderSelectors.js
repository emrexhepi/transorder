// returns all streams from redux store
export function getStreamsFromStore(store) {
    const state = store.getState();

    return state.transcoder.streams;
}

// returns stream by id from store
export function getStreamFromStore(store, streamID) {
    return getStreamsFromStore(store)[streamID];
}

// returns scheduler settings
export function getSchedSettingsFromStore(store) {
    const state = store.getState();
    return state.transcoder.schedulerSettings;
}

// returns recorder settings
export function getRecorderSettingsFromStore(store) {
    const state = store.getState();
    return state.transcoder.recorderSettings;
}

// ///////////////////////////////////////////////
// RECORDER SELECTORS

// returns recorder data from store
export function getRecorderFromStore(store, recorderID) {
    const state = store.getState();

    if (state.transcoder.recorders[recorderID]) {
        return state.transcoder.recorders[recorderID];
    }

    return {};
}

export default null;
