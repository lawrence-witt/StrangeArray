import {
    SET_HOVER,

    FOCUS_ELEMENT, 
    UNFOCUS_ELEMENTS,

    START_TRANSITION, 
    PERSIST_TRANSITION, 
    COMPLETE_TRANSITION,

    TOGGLE_DELETION, 
    PREP_FOR_DELETION,

    TOGGLE_SWAP,
    PREP_FOR_SWAP,
    RESET_SWAP } from '../actions/types';

const initialState = {
    view: 'home',
    prevTransitionActive: false,
    transitionActive: false,
    transitionDestination: '',

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
    }
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_HOVER:
            return {
                ...state,
                hoverActive: action.payload
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
        case START_TRANSITION:
            return {
                ...state,
                prevTransitionActive: false,
                transitionActive: true,
                transitionDestination: action.payload.destination
            }
        case PERSIST_TRANSITION:
            return {
                ...state,
                view: action.payload.destination,
                prevTransitionActive: true,
                transitionActive: false
            }
        case COMPLETE_TRANSITION:
            return {
                ...state,
                prevTransitionActive: false,
                transitionDestination: ''
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
        default:
            return state;
    }
}