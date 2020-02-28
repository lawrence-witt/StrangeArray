import { EXPAND_STACK, COLLAPSE_STACK, UPDATE_PATH} from './types';

export const expandStack = (newRoot, newFieldElements, newFocus) => (dispatch, getState) => {
    
    const currentFocus = getState().stack.focusPosition;
    newFocus = [currentFocus[0], newFocus, currentFocus[2]];

    dispatch({type: UPDATE_PATH, payload: newRoot.slice(1)});

    dispatch({
        type: EXPAND_STACK,
        payload: {
            newFocus,
            newFieldElements,
            newRoot
        }
    });
}

export const collapseStack = (newRoot, newFieldElements, newFocus) => (dispatch, getState) => {

    const activeFieldElements = getState().stack.activeFieldElements.slice();
    const activeRoots = getState().stack.activeRoots.slice();
    const newActiveFieldElements = activeFieldElements.filter(e => newRoot.length >= e.length);
    const newActiveRoots = activeRoots.filter(e => newRoot.length > e.length);
    const topRoot = newActiveRoots[newActiveRoots.length-1] || [];

    const currentFocus = getState().stack.focusPosition;
    newFocus = [currentFocus[0], newFocus, currentFocus[2]];

    dispatch({type: UPDATE_PATH, payload: topRoot.slice(1)});

    dispatch({
        type: COLLAPSE_STACK,
        payload: {
            newFocus,
            newActiveFieldElements,
            newFieldElements,
            newActiveRoots,
            topRoot
        }
    });
}