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
    let streams = {};
    switch (action.type) {
        // ///////////////////////////////////
        // ##### GENERAL REDUCERS
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
            streams = Object.assign({}, state.streams);
            // set error message
            streams[action.streamID].error = action.payload;
            // set record value
            streams[action.streamID].record = action.record;

            // return state
            return Object.assign(
                {},
                state,
                {
                    streams,
                },
            );
        
         // ///////////////////////////////////
        // ##### RECORDER REDUCERS
        case actionTypes.SET_RECORDER_TO_STREAM:
            // get streams
            streams = Object.assign({}, state.streams);
            console.log(streams);
            streams[action.streamID].recordingLogs[action.recorderID] = {};
            streams[action.streamID].recordingLogs[action.recorderID] = action.payload;
            
            return streams;

        default:
            return state;
    }
}


export default reducer;
