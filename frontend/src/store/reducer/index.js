import { combineReducers } from 'redux';
import { userReducer } from "./user";
import { spaceReducer } from './space';
import { toggleReducer } from './toggle';

export default combineReducers({
    user: userReducer,
    space: spaceReducer,
    toggle: toggleReducer
});
