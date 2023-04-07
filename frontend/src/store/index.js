import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from './reducer';
import thunkMiddleware from 'redux-thunk'

const middlewareEnhancer = applyMiddleware(thunkMiddleware)
const composedEnhancers = compose(middlewareEnhancer);

export default createStore(rootReducer, undefined, composedEnhancers);