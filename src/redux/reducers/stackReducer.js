import { EXPAND_STACK } from '../actions/types';

const initialState = {
    masterBasePosition: [0, 0, 0],
    baseFieldSize: 6,
    unitPadPerc: 0.3,
    layerPadPerc: 0.5,

    activeFieldElements: ['base'],
    topLayer: ''
};

export default function(state = initialState, action) {
    switch(action.type) {
        case EXPAND_STACK:
            return {
                ...state,
                activeFieldElements: [
                    ...state.activeFieldElements, 
                    ...action.payload.newFieldElements
                ],
                topLayer: action.payload.topLayer
            }
            default:
                return state
    }
}