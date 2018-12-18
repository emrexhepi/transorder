import { createStore, combineReducers } from 'redux';

import transcoder from './reducers/transcoderReducers';

// Redux Setup

// action tracker reducer
// eslint-disable-next-line no-unused-vars
function lastAction(state = null, action) {
    return action;
}

const rootReducer = combineReducers({
    transcoder,
    lastAction,
});

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
const store = createStore(rootReducer);

export default store;
