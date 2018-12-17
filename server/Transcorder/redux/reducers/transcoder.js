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
            return {
                ...state,
                streams: action.payload,
            };

        case actionTypes.STORE_FFMPEG_SETTINGS:
            return {
                ...state,
                ffmpegSettings: action.payload,
            };

        case actionTypes.STORE_SCHEDULER_SETTINGS:
            return {
                ...state,
                schedulerSettings: action.payload,
            };
        
        default:
            return state;
    }
}


export default reducer;
