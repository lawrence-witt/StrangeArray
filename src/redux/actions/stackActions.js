import { EXPAND_STACK, COLLAPSE_STACK } from './types';
import store from '../store';

export const expandStack = (topLayer, newFieldElements) => {
    return {
        type: EXPAND_STACK,
        payload: {
            topLayer,
            newFieldElements
        }
    }
}