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

    TOGGLE_CONTROLS} from '../actions/types';

const initialState = {
    view: 'home',
    transitionActive: false,
    transitionDestination: '',
    userUpload: false,

    hoverActive: false,

    focusActive: false,
    focussedElement: {
        element: null, 
        path: null
    },

    deletionActive: false,
    pendingDeletion: null,

    swapActive: false,
    pendingSwap: {
        0: {
            element: null,
            path: [],
        },
        1: {
            element: null,
            path: []
        },
        stage: 0
    },

    downloadActive: false,

    controlsActive: false
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_HOVER:
            return {
                ...state,
                hoverActive: action.payload
            }
        case START_TRANSITION:
            return {
                ...state,
                transitionActive: true,
                transitionDestination: action.payload.destination
            }
        case COMPLETE_TRANSITION:
            return {
                ...state,
                view: state.transitionDestination,
                transitionActive: false,
                transitionDestination: ''
            }
        case SET_USER_UPLOAD:
            return {
                ...state,
                userUpload: action.payload
            }
        case FOCUS_ELEMENT:
            return {
                ...state,
                focusActive: action.payload.activity,
                focussedElement: { element: action.payload.element, path: action.payload.path }
            }
        case UNFOCUS_ELEMENTS:
            return {
                ...state,
                focusActive: false
            }
        case TOGGLE_DELETION:
            return {
                ...state,
                deletionActive: action.payload
            }
        case PREP_FOR_DELETION:
            return {
                ...state,
                pendingDeletion: action.payload
            }
        case TOGGLE_SWAP:
            return {
                ...state,
                swapActive: action.payload
            }
        case PREP_FOR_SWAP:
            return {
                ...state,
                pendingSwap: action.payload
            }
        case RESET_SWAP:
            return {
                ...state,
                pendingSwap: initialState.pendingSwap
            }
        case TOGGLE_DOWNLOAD:
            return {
                ...state,
                downloadActive: action.payload
            }
        case TOGGLE_CONTROLS:
            return {
                ...state,
                controlsActive: action.payload
            }
        default:
            return state;
    }
}