/* eslint-disable no-case-declarations */
import * as actionTypes from '../actions/actionTypes';

// Initial State
const initState = {
    streams: [],
    ffmpegSettings: {},
    schedulerSettings: {},
};

// reducers
function reducer(state = initState, action) {
    switch (action.type) {
        case actionTypes.STORE_STREAMS:
            return Object.assign(
                {},
                state,
                {
                    streams: action.payload,
                },
            );

        case actionTypes.STORE_RECORDER_SETTINGS:
            return Object.assign(
                {},
                state,
                {
                    recorderSettings: action.payload,
                },
            );

        case actionTypes.STORE_SCHEDULER_SETTINGS:
            return Object.assign(
                {},
                state,
                {
                    schedulerSettings: action.payload,
                },
            );

        case actionTypes.SET_STREAM_ERROR: 
            // get streams
            const streams = Object.assign({}, state.streams);
            // set error message
            streams[action.streamId].error = action.payload;
            // set record value
            streams[action.streamId].record = action.record;

            // return state
            return Object.assign(
                {},
                state,
                {
                    streams,
                },
            );
        
        default:
            return state;
    }
}


export default reducer;
