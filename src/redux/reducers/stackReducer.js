import { EXPAND_STACK, COLLAPSE_STACK, ADD_TO_STACK, REMOVE_FROM_STACK, CLEAR_STACK } from '../actions/types';

const initialState = {
    demoArray: [[[[[[[{type: 'Boolean', content: true}]]]]]]],
    userArray: [],
    currentPath: [],
    dimensions: 6,

    masterBasePosition: [0, 0, 0],
    focusPosition: [0, 0, 0],
    baseFieldSize: 6,
    unitPadPerc: 0.3,
    layerPadPerc: 0.5,

    activeFieldElements: [['base']],
    topFieldLayer: [['base']],
    activeRoots: [],
    topRoot: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case EXPAND_STACK:
            return {
                ...state,
                currentPath: action.payload.newPath,
                focusPosition: action.payload.newFocus,
                activeFieldElements: [
                    ...state.activeFieldElements, 
                    ...action.payload.newFieldElements
                ],
                topFieldLayer: action.payload.newFieldElements,
                activeRoots: [
                    ...state.activeRoots, 
                    action.payload.newRoot
                ],
                topRoot: action.payload.newRoot
            }
        case COLLAPSE_STACK:
            return {
                ...state,
                currentPath: action.payload.newPath,
                focusPosition: action.payload.newFocus,
                activeFieldElements: action.payload.newActiveFieldElements,
                topFieldLayer: action.payload.newFieldElements,
                activeRoots: action.payload.newActiveRoots,
                topRoot: action.payload.topRoot
            }
        case ADD_TO_STACK:
            return {
                ...state,
                userArray: action.payload.newUserArray,
                activeFieldElements: action.payload.newActiveFieldElements,
                topFieldLayer: action.payload.newTopFieldLayer
            }
        case REMOVE_FROM_STACK:
            return {
                ...state,
                userArray: action.payload.newUserArray,
                activeFieldElements: action.payload.newActiveFieldElements,
                topFieldLayer: action.payload.newTopFieldLayer
            }
        case CLEAR_STACK:
            return {
                ...state,
                currentPath: [],

                focusPosition: [0, 0, 0],

                activeFieldElements: [['base']],
                topFieldLayer: [['base']],
                activeRoots: [],
                topRoot: []
            }
            default:
                return state
    }
}