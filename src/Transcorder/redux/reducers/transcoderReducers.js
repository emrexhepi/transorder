/* eslint-disable no-case-declarations */
const actionTypes = require('../actions/actionTypes');

// Initial State
const initState = {
    streams: [],
    ffmpegSettings: {},
    schedulerSettings: {},
    recorders: {},
};

// reducers
function reducer(state = initState, action) {
    let recorders = {};
    
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
            
        // add recorder settings to store
        case actionTypes.STORE_RECORDER_SETTINGS:
            return Object.assign(
                {},
                state,
                {
                    recorderSettings: action.payload,
                },
            );
        
        // add schedule settings in to store
        case actionTypes.STORE_SCHEDULER_SETTINGS:
            return Object.assign(
                {},
                state,
                {
                    schedulerSettings: action.payload,
                },
            );
        
        // ///////////////////////////////////
        // ##### RECORDER REDUCERS

        // add recorder info in to store
        case actionTypes.SET_RECORDER:
            const recorder = {};
            const { ID } = action.payload;
            recorder[ID] = {
                ...action.payload,
                fileLogs: [],
            };

            recorders = Object.assign(state.recorders, recorder);

            const newState = {
                ...state,
                recorders,
            };
            
            return newState;

        // update recorder
        case actionTypes.UPDATE_RECORDER:
            recorders = Object.assign({}, state.recorders);
            recorders[action.payload.ID] = Object.assign(
                {},
                state.recorders[action.payload.ID],
                {
                    recordDuration: action.payload.recordDuration,
                    schedule: action.payload.schedule,
                },
            );

            return {
                ...state,
                recorders,
            };

        
        // update logs of recorder
        case actionTypes.PUSH_LOG_TO_RECORDER:
            recorders = Object.assign({}, state.recorders);
            recorders[action.ID] = Object.assign(
                {},
                state.recorders[action.ID],
                {
                    fileLogs: [
                        ...recorders[action.ID].fileLogs,
                        action.payload,
                    ],
                },
            );
    
            return {
                ...state,
                recorders,
            };
        
        // change recorder field
        case actionTypes.UPDATE_RECORDER_FIELD:
            recorders = Object.assign({}, state.recorders);
            recorders[action.ID] = Object.assign(
                {},
                state.recorders[action.ID],
                action.payload,
            );

            return {
                ...state,
                recorders,
            };

        // remove recorder from store
        case actionTypes.REMOVE_RECORDER:
            recorders = Object.assign({}, state.recorders);

            if (typeof recorders[action.payload.ID] !== 'undefined') {
                delete recorders[action.payload.ID];
            }

            return {
                ...state,
                recorders,
            };

        default:
            return state;
    }
}

module.exports = reducer;
