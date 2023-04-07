import { combineReducers } from 'redux';
import { userReducer } from "./user";
import { spaceReducer } from './space';

export default combineReducers({
    user: userReducer,
    space: spaceReducer,
});
