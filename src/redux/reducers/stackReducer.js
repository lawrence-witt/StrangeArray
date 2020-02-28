import { EXPAND_STACK, COLLAPSE_STACK, INSERT_STACK, CLEAR_STACK } from '../actions/types';

const initialState = {
    masterBasePosition: [0, 0, 0],
    baseFieldSize: 6,
    unitPadPerc: 0.3,
    layerPadPerc: 0.5,

    focusPosition: [0, 0, 0],

    activeFieldElements: ['base'],
    topFieldLayer: ['base'],
    activeRoots: [],
    topRoot: ''
};

export default function(state = initialState, action) {
    switch(action.type) {
        case EXPAND_STACK:
            return {
                ...state,
                focusPosition: action.payload.newFocus,
                activeFieldElements: [
                    ...state.activeFieldElements, 
                    ...action.payload.newFieldElements
                ],
                topFieldLayer: action.payload.newFieldElements,
                activeRoots: [...state.activeRoots, action.payload.newRoot],
                topRoot: action.payload.newRoot
            }
        case COLLAPSE_STACK:
            return {
                ...state,
                focusPosition: action.payload.newFocus,
                activeFieldElements: action.payload.newActiveFieldElements,
                topFieldLayer: action.payload.newFieldElements,
                activeRoots: action.payload.newActiveRoots,
                topRoot: action.payload.topRoot
            }
        case INSERT_STACK:
            return {
                ...state,
                activeFieldElements: [...state.activeFieldElements, action.payload],
                topFieldLayer: [...state.topFieldLayer, action.payload]
            }
        case CLEAR_STACK:
            return {
                ...state,
                focusPosition: [0, 0, 0],

                activeFieldElements: ['base'],
                topFieldLayer: ['base'],
                activeRoots: [],
                topRoot: ''
            }
            default:
                return state
    }
}