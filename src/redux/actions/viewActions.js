import {
    SET_HOVER,
    START_TRANSITION, 
    PERSIST_TRANSITION, 
    COMPLETE_TRANSITION,
    TOGGLE_DELETION,
    PREP_FOR_DELETION,
    CLEAR_STACK } from './types';

export const setHover = bool => dispatch => {
    dispatch({
        type: SET_HOVER,
        payload: bool
    })
}

export const startTransition = destination => dispatch => {

    dispatch({ type: CLEAR_STACK });

    dispatch({
        type: START_TRANSITION,
        payload: {
            destination
        }
    })
}

export const persistTransition = () => (dispatch, getState) => {
    const destination = getState().view.transitionDestination;

    dispatch({
        type: PERSIST_TRANSITION,
        payload: {
            destination
        }
    });
}

export const completeTransition = () => dispatch => {

    dispatch({ type: COMPLETE_TRANSITION });
}

export const prepForDeletion = (element, path, reset=false) => dispatch => {

    if(reset) {
        dispatch({
            type: PREP_FOR_DELETION,
            payload: null
        })
    } else {
        dispatch({ 
            type: PREP_FOR_DELETION,
            payload: {
                element,
                path
            }
        })
    }
}

export const toggleDeletion = newState => dispatch => {

    dispatch({ type: TOGGLE_DELETION, payload: newState });
}