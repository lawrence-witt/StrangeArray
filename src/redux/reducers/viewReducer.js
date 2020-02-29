import { START_TRANSITION, PERSIST_TRANSITION, COMPLETE_TRANSITION, TOGGLE_DELETION } from '../actions/types';

const initialState = {
    view: 'home',
    prevTransitionActive: false,
    transitionActive: false,
    transitionDestination: '',

    deletionActive: false
};

export default function(state = initialState, action) {
    switch(action.type) {
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
        default:
            return state;
    }
}