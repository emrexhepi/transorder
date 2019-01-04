// returns all streams from redux store
export function getStreamsFromStore(store) {
    const state = store.getState();

    return state.transcoder.streams;
}

// returns stream by id from store
export function getStreamFromStore(store, streamId) {
    return getStreamsFromStore(store)[streamId];
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

export default null;
