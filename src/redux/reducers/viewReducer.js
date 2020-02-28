import { START_TRANSITION, PERSIST_TRANSITION, COMPLETE_TRANSITION } from '../actions/types';

const initialState = {
    view: 'home',
    prevTransitionActive: false,
    transitionActive: false,
    transitionDestination: ''
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
        default:
            return state;
    }
}