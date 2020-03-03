import { combineReducers } from 'redux';
import viewReducer from './viewReducer';
import stackReducer from './stackReducer';

export default combineReducers({
    view: viewReducer,
    stack: stackReducer
})