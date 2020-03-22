import {
    UPDATE_UNIT_PADDING,
    UPDATE_LAYER_PADDING,
    REFOCUS_STACK,
    SET_CUSTOM_USER_ARRAY,
    SET_RAW_USER_ARRAY,
    EXPAND_STACK, 
    COLLAPSE_STACK, 
    ADD_TO_STACK, 
    REMOVE_FROM_STACK, 
    CLEAR_STACK,
    INITIALISE_STACK,
    SWAP_STACK} from '../actions/types';

const initialState = {
    demoArray: [[[[[[[{type: 'Boolean', content: true}]]]]]]],
    rawUserArray: '',
    userArray: [],
    currentPath: [],
    dimensions: 6,

    masterBasePosition: [0, 0, 0],
    focusPosition: [0, 0, 0],
    baseFieldSize: 6,
    unitPadPerc: 0.3,
    layerPadPerc: 1,

    activeFieldElements: [],
    topFieldLayer: [],
    activeRoots: [],
    topRoot: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case UPDATE_UNIT_PADDING:
            return {
                ...state,
                unitPadPerc: action.payload
            }
        case UPDATE_LAYER_PADDING: {
            return {
                ...state,
                layerPadPerc: action.payload
            }
        }
        case REFOCUS_STACK:
            return {
                ...state,
                focusPosition: action.payload
            }
        case SET_CUSTOM_USER_ARRAY:
            return {
                ...state,
                userArray: action.payload
            }
        case SET_RAW_USER_ARRAY:
            return {
                ...state,
                rawUserArray: action.payload
            }
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
        case SWAP_STACK:
            return {
                ...state,
                userArray: action.payload
            }
        case CLEAR_STACK:
            return {
                ...state,
                currentPath: initialState.currentPath,

                focusPosition: initialState.focusPosition,
                unitPadPerc: initialState.unitPadPerc,
                layerPadPerc: initialState.layerPadPerc,

                activeFieldElements: initialState.activeFieldElements,
                topFieldLayer: initialState.topFieldLayer,
                activeRoots: initialState.activeRoots,
                topRoot: initialState.topRoot
            }
        case INITIALISE_STACK:
            return {
                ...state,
                activeFieldElements: action.payload,
                topFieldLayer: action.payload
            }
            default:
                return state
    }
}