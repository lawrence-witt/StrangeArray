import { ADD_TO_ARRAY, DELETE_FROM_ARRAY, UPDATE_PATH } from '../actions/types';

const initialState = {
    //userArray: [1, 2, [3, [4, 5, 6, [7, 8, [9, 10]]]]],
    //userArray: [1, 2, 3, 4, [1, [2, 3, 4, 5, 6, 7, 8, 9, 10, [1, new Array(300).fill(0)]]]],
    //demoArray: [1, [2, [3]]],
    //userArray: [[1, 2]],
    //baseArray: [1, 2]
    demoArray: [[[[[[[1]]]]]]],
    userArray: [[1], 2, 3, [5, [6, 7]]],
    //userArray: [],
    currentPath: [],
    dimensions: 6
};

export default function(state = initialState, action) {
    switch(action.type) {
        case ADD_TO_ARRAY:
            return {
                ...state,
                userArray: action.payload
            }
        case DELETE_FROM_ARRAY:
            return {
                ...state,
                userArray: action.payload
            }
        case UPDATE_PATH:
            return {
                ...state,
                currentPath: action.payload
            }
        default:
            return state;
    }
}