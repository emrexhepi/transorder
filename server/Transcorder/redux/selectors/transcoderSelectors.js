// returns all streams from redux store
export function getStreamsFromStore(store) {
    const state = store.getState();

    return state.transcoder.streams;
}

// returns stream by id from store
export function getStreamFromStore(store, streamId) {
    return getStreamsFromStore(store)[streamId];
}

export default null;
