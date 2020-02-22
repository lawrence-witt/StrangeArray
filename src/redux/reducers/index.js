import { combineReducers } from 'redux';
import viewReducer from './viewReducer';
import arrayReducer from './arrayReducer';
import stackReducer from './stackReducer';

export default combineReducers({
    view: viewReducer,
    array: arrayReducer,
    stack: stackReducer
})