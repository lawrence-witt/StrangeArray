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
    RESET_SWAP} from '../actions/types';

const initialState = {
    view: 'home',
    transitionActive: false,
    transitionDestination: '',
    userUpload: false,

    hoverActive: false,

    editorState: {
        add: false,
        remove: false,
        swap: false,
        download: false,
        controls: false,
        focus: false
    },

    focussedElement: {
        element: {
            type: '',
            content: ''
        }, 
        path: []
    },

    pendingDeletion: {
        element: {
            type: '',
            content: ''
        },
        path: []
    },

    pendingSwap: {
        0: {
            element: {
                type: '',
                content: ''
            },
            path: [],
        },
        1: {
            element: {
                type: '',
                content: ''
            },
            path: []
        },
        stage: 0
    }
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_HOVER:
            return {
                ...state,
                hoverActive: action.payload
            }
        case SET_EDITOR_STATE:
            return {
                ...state,
                editorState: action.payload
            }
        case SET_USER_UPLOAD:
            return {
                ...state,
                userUpload: action.payload
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
        case FOCUS_ELEMENT:
            return {
                ...state,
                editorState: {
                    ...initialState.editorState,
                    focus: true
                },
                focussedElement: { 
                    element: action.payload.element, 
                    path: action.payload.path 
                }
            }
        case UNFOCUS_ELEMENTS:
            return {
                ...state,
                focussedElement: initialState.focussedElement
            }
        case PREP_FOR_DELETION:
            return {
                ...state,
                pendingDeletion: action.payload
            }
        case RESET_DELETION:
            return {
                ...state,
                pendingDeletion: initialState.pendingDeletion
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
        default:
            return state;
    }
}