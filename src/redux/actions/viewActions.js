import {
    SET_HOVER,

    FOCUS_ELEMENT,
    UNFOCUS_ELEMENTS,

    START_TRANSITION, 
    COMPLETE_TRANSITION,
    SET_USER_UPLOAD,

    TOGGLE_DELETION,
    PREP_FOR_DELETION,

    TOGGLE_SWAP,
    PREP_FOR_SWAP,
    RESET_SWAP,

    TOGGLE_DOWNLOAD,

    TOGGLE_CONTROLS,

    // Stack Actions
    CLEAR_STACK,
    INITIALISE_STACK} from './types';
    

// Set the pointer to cursor on the canvas container when hovering on cube
export const setHover = bool => dispatch => {

    dispatch({
        type: SET_HOVER,
        payload: bool
    })
}

// Place a new focussed element in the store, or reset it
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

    dispatch({ 
        type: UNFOCUS_ELEMENTS 
    });
}

// Reset all information about stack placement in the store and signal current stack to transition out
export const startTransition = destination => dispatch => {

    dispatch({ 
        type: CLEAR_STACK 
    });

    dispatch({
        type: START_TRANSITION,
        payload: {
            destination
        }
    });
}

// Resets all transition state for the next transition
export const completeTransition = () => (dispatch, getState) => {
    const userArray = getState().stack.userArray.slice();
    const destination = getState().view.transitionDestination;
    const basePaths = destination === 'home' ? [] : userArray.map((e, i) => [i.toString()]);

    dispatch({
        type: INITIALISE_STACK,
        payload: basePaths
    });

    dispatch({ 
        type: COMPLETE_TRANSITION 
    });
}

// Notifies the home/edit overlays when user submits custom array
export const setUserUpload = bool => dispatch => {

    dispatch({
        type: SET_USER_UPLOAD,
        payload: bool
    })
}

// Toggle the deletion mode which changes cube click behaviour
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

// Toggle the swap mode which changes cube click behaviour
export const toggleSwap = bool => dispatch => {

    dispatch({
        type: TOGGLE_SWAP,
        payload: bool
    })
}

export const prepForSwap = (element, path, add=true) => (dispatch, getState) => {
    
    const pendingSwap = Object.assign({}, getState().view.pendingSwap);

    if(add) {
        pendingSwap[pendingSwap.stage] = {
            element,
            path,
        };
        pendingSwap.stage = pendingSwap.stage === 0 ? 1 : 0;
    } else {
        if(pendingSwap[0].path.join(',') === path.join(',')) {
            pendingSwap[0] = {
                element: null,
                path: []
            };
            pendingSwap.stage = 0;
        } else if(pendingSwap[1].path.join(',') === path.join(',')) {
            pendingSwap[1] = {
                element: null,
                path: []
            };
            pendingSwap.stage = !pendingSwap[0].element ? 0 : 1;
        }
    }

    dispatch({
        type: PREP_FOR_SWAP,
        payload: pendingSwap
    });
}

export const resetSwap = () => dispatch => {

    dispatch({
        type: RESET_SWAP
    });
}

export const toggleDownload = bool => dispatch => {

    dispatch({
        type: TOGGLE_DOWNLOAD,
        payload: bool
    })
}

export const toggleControls = bool => dispatch => {

    dispatch({
        type: TOGGLE_CONTROLS,
        payload: bool
    })
}