import { TEST_ARRAY } from '../actions/types';

const initialState = {
    /* baseArray: [1, 2, [3, [4, 5, 6, [7, 8, [9, 10]]]]] */
    baseArray: [1, [2, [3]]]
};

export default function(state = initialState, action) {
    switch(action.type) {
        case TEST_ARRAY:
            return {
                ...state
            }
        default:
            return state;
    }
}