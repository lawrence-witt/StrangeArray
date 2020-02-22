import { TRANSITION_VIEW } from '../actions/types';

const initialState = {
    view: 'home'
};

export default function(state = initialState, action) {
    switch(action.type) {
        case TRANSITION_VIEW:
            return state;
        default:
            return state;
    }
}