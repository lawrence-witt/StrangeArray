import {
    SET_HOVER,

    FOCUS_ELEMENT,
    UNFOCUS_ELEMENTS,

    START_TRANSITION, 
    PERSIST_TRANSITION, 
    COMPLETE_TRANSITION,

    TOGGLE_DELETION,
    PREP_FOR_DELETION,

    CLEAR_STACK } from './types';

// Set the pointer to cursor on the canvas container when hovering on cube
export const setHover = bool => dispatch => {

    dispatch({
        type: SET_HOVER,
        payload: bool
    })
}

// Store a new focussed element in the store, or reset it
export const focusElement = (element, path, reset=false) => dispatch => {
    
    if(reset) {
        dispatch({
            type: FOCUS_ELEMENT,
            payload: {
                element: null,
                path: null,
                activity: false
            }
        })
    } else {
        dispatch({
            type: FOCUS_ELEMENT,
            payload: {
                element,
                path,
                activity: true
            }
        });
    };
}

// Signal to the Focus Modal that it needs to close
export const unfocusElements = () => dispatch => {

    dispatch({ type: UNFOCUS_ELEMENTS });
}

// Reset all information about stack placement in the store and signal current stack to transition out
export const startTransition = destination => dispatch => {

    dispatch({ type: CLEAR_STACK });

    dispatch({
        type: START_TRANSITION,
        payload: {
            destination
        }
    })
}

// Signals that the current stack has transitioned out and view can switch to new stack
export const persistTransition = () => (dispatch, getState) => {
    const destination = getState().view.transitionDestination;

    dispatch({
        type: PERSIST_TRANSITION,
        payload: {
            destination
        }
    });
}

// Resets all transition state for the next transition
export const completeTransition = () => dispatch => {

    dispatch({ type: COMPLETE_TRANSITION });
}

// Toggle the deletion mode which triggers delete modal and changes cube click behaviour
export const toggleDeletion = bool => dispatch => {

    dispatch({ 
        type: TOGGLE_DELETION, 
        payload: bool 
    });
}

// Single out an element for deletion confirmation when it is clicked on in deletion mode, reset the stored value when modal closes
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