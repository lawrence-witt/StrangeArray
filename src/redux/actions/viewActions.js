import {
    SET_HOVER,
    SET_EDITOR_STATE,

    SET_USER_UPLOAD,
    START_TRANSITION, 
    COMPLETE_TRANSITION,

    FOCUS_ELEMENT,
    UNFOCUS_ELEMENTS,

    PREP_FOR_DELETION,
    RESET_DELETION,

    PREP_FOR_SWAP,
    RESET_SWAP,

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

export const setEditorState = mode => (dispatch, getState) => {
    // Possily rework all this use to use initial state in the reducer instead?
    const editorState = getState().view.editorState;

    const newEditState = Object.keys(editorState).reduce((obj, key) => {
        key === mode ? 
            obj[key] = !editorState[key] :
            obj[key] = false;
        return obj;
    }, {});

    dispatch({
        type: SET_EDITOR_STATE,
        payload: newEditState
    })
}

// Notifies the home/edit overlays when user submits custom array
export const setUserUpload = bool => dispatch => {

    dispatch({
        type: SET_USER_UPLOAD,
        payload: bool
    })
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

// Place a new focussed element in the store, or reset it
export const focusElement = (element, path) => (dispatch, getState) => {
    

    dispatch({
        type: FOCUS_ELEMENT,
        payload: {
            element,
            path
        }
    });
}

export const unfocusElements = () => dispatch => {

    dispatch({
        type: UNFOCUS_ELEMENTS
    })
}


// Single out an element for deletion confirmation when it is clicked on in deletion mode, reset the stored value when modal closes
export const prepForDeletion = (element, path, add=true) => dispatch => {

    if(add) {
        dispatch({ 
            type: PREP_FOR_DELETION,
            payload: {
                element,
                path
            }
        })
    } else {
        dispatch({
            type: PREP_FOR_DELETION,
            payload: {
                element: {
                    type: '',
                    content: ''
                },
                path: []
            }
        })
    }
}

export const resetDeletion = () => dispatch => {

    dispatch({
        type: RESET_DELETION
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