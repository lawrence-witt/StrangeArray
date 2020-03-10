import {
    SET_USER_UPLOAD,
    PREP_FOR_DELETION,
    TOGGLE_DOWNLOAD,
    
    UPDATE_UNIT_PADDING,
    UPDATE_LAYER_PADDING,
    REFOCUS_STACK,
    SET_CUSTOM_USER_ARRAY,
    SET_RAW_USER_ARRAY,
    EXPAND_STACK, 
    COLLAPSE_STACK, 
    ADD_TO_STACK, 
    REMOVE_FROM_STACK,
    SWAP_STACK } from './types';


export const updateUnitPadding = newValue => dispatch => {
    dispatch({
        type: UPDATE_UNIT_PADDING,
        payload: newValue
    })
}

export const updateLayerPadding = newValue => dispatch => {
    dispatch({
        type: UPDATE_LAYER_PADDING,
        payload: newValue
    })
}

export const refocusStack = newFocus => (dispatch, getState) => {
    const currentFocus = getState().stack.focusPosition;

    // This is a temporary fix: the Calculator functions should be reworked during testing
    newFocus = !newFocus ? [0, 0, 0] : [currentFocus[0], newFocus, currentFocus[2]];

    dispatch({
        type: REFOCUS_STACK,
        payload: newFocus
    })
}

export const setCustomUserArray = (customArray, reset=false) => dispatch => {
    const dataModel = (type, content) => ({
        type,
        content
    });

    if (reset) {
        dispatch({
            type: SET_CUSTOM_USER_ARRAY,
            payload: []
        })
    } else {
        function formatArray(array) {
            return array.map(element => {
                if(!element) {
                    return dataModel('Null', null)
                } else if (Array.isArray(element)) {
                    return formatArray(element);
                } else if (element.constructor === Object) {
                    return dataModel('Object', JSON.stringify(element));
                } else if (typeof element === 'number') {
                    return dataModel('Number', element);
                } else if (typeof element === 'string') {
                    return dataModel('String', element);
                } else if (typeof element === 'boolean') {
                    return dataModel('Boolean', element.toString());
                };
            })
        }
    
        const formattedArray = formatArray(customArray);
    
        dispatch({
            type: SET_CUSTOM_USER_ARRAY,
            payload: formattedArray
        });
    
        dispatch({
            type: SET_USER_UPLOAD,
            payload: true
        });
    }
}

export const setRawUserArray = () => (dispatch, getState) => {
    const userArray = getState().stack.userArray.slice();

    function unformatArray(array) {
        return array.map(element => {
            if(Array.isArray(element)) {
                return unformatArray(element);
            } else if (element.type === 'Null') {
                return null;
            } else if (element.type === 'Object') {
                return JSON.parse(element.content);
            } else if (element.type === 'Number') {
                return element.content;
            } else if (element.type === 'String') {
                return element.content;
            } else if (element.type === 'Boolean') {
                return element.content === 'True' ? true : false;
            }
        })
    }

    const unformattedArray = JSON.stringify(unformatArray(userArray));

    dispatch({
        type: SET_RAW_USER_ARRAY,
        payload: unformattedArray
    });

    dispatch({
        type: TOGGLE_DOWNLOAD,
        payload: true
    })
}

export const expandStack = (newRoot, newFieldElements, newFocus) => (dispatch, getState) => {
    const currentFocus = getState().stack.focusPosition;

    // This is a temporary fix: the Calculator functions should be reworked during testing
    newFocus = !newFocus ? [0, 0, 0] : [currentFocus[0], newFocus, currentFocus[2]];

    dispatch({
        type: EXPAND_STACK,
        payload: {
            newPath: newRoot.slice(1),
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

    dispatch({
        type: COLLAPSE_STACK,
        payload: {
            newPath: topRoot.slice(1),
            newFocus,
            newActiveFieldElements,
            newFieldElements,
            newActiveRoots,
            topRoot
        }
    });
}

export const addToStack = newElement => (dispatch, getState) => {
    newElement = newElement.type === 'Array' ? [] : newElement;

    const currentPath = getState().stack.currentPath.slice();
    const userArray = getState().stack.userArray.slice();

    const activeFieldElements = getState().stack.activeFieldElements.slice();
    const topFieldLayer = getState().stack.topFieldLayer.slice();
    const topRoot = getState().stack.topRoot.slice();

    // Takes in an array of indexes, the multidimensional array of elements it refers to, and a new element to insert. 
    // Traverses the array of elements using the indexPath and pushes the new element at the final index.
    // Example: ([0, 1], [[1, [2]], 3], 'element') returns [[1, [2, 'element']], 3].
    function traverseAdd(indexPath, array, element) {
        const idx = indexPath.shift();
        if (idx === undefined) return [...array, element];
        const [ step ] = array.splice(idx, 1);
        if (indexPath.length === 0) {
            const insert = [...step, element];
            array.splice(idx, 0, insert);
        } else {
            const next = traverseAdd(indexPath, step, element);
            array.splice(idx, 0, next);
        }
        return array;
    }

    const pathGen = topRoot.length <= 1 ? ['base', userArray.length] : [...topRoot, topFieldLayer.length];
    const newUserArray = traverseAdd(currentPath, userArray, newElement);
    const newActiveFieldElements = topRoot.length > 0 ? [...activeFieldElements, pathGen] : activeFieldElements;
    const newTopFieldLayer = topRoot.length > 0 ? [...topFieldLayer, pathGen] : topFieldLayer;
    
    dispatch({
        type: ADD_TO_STACK,
        payload: {
            newUserArray,
            newActiveFieldElements,
            newTopFieldLayer
        }
    });
}

export const removeFromStack = path => (dispatch, getState) => {
    const userArray = getState().stack.userArray.slice();
    const activeFieldElements = getState().stack.activeFieldElements.slice();
    const topFieldLayer = getState().stack.topFieldLayer.slice();
    const topRoot = getState().stack.topRoot.slice();

    path = path.slice(1);

    function traverseRemove(indexPath, array) {
        const idx = indexPath.shift();
        if (idx === undefined) return [];
        const [ step ] = array.splice(idx, 1);
        if (indexPath.length !== 0) {
            const next = traverseRemove(indexPath, step);
            array.splice(idx, 0, next);
        }
        return array;
    }

    const newUserArray = traverseRemove(path, userArray);
    const newActiveFieldElements = topRoot.length > 0 ? activeFieldElements.slice(0, activeFieldElements.length-1) : activeFieldElements;
    const newTopFieldLayer = topRoot.length > 0 ? topFieldLayer.slice(0, topFieldLayer.length-1) : topFieldLayer;
    
    dispatch({
        type: REMOVE_FROM_STACK,
        payload: {
            newUserArray,
            newActiveFieldElements,
            newTopFieldLayer
        }
    });

    dispatch({
        type: PREP_FOR_DELETION,
        payload: null
    });
}

export const swapStack = () => (dispatch, getState) => {
    const pendingSwap = Object.assign({}, getState().view.pendingSwap);
    const userArray = getState().stack.userArray.slice();

    if (pendingSwap[0].element.type === 'Array') pendingSwap[0].element = pendingSwap[0].element.content;
    if (pendingSwap[1].element.type === 'Array') pendingSwap[1].element = pendingSwap[1].element.content;

    function traverseReplace(indexPath, array, element) {
        const idx = indexPath.shift();
        if (idx === undefined) return [];
        if (indexPath.length === 0) {
            array.splice(idx, 1, element);
        } else {
            const [ step ] = array.splice(idx, 1);
            const next = traverseReplace(indexPath, step, element);
            array.splice(idx, 0, next);
        };
        return array;
    }

    let newUserArray;
    newUserArray = traverseReplace(pendingSwap[0].path.slice(1), userArray, pendingSwap[1].element);
    newUserArray = traverseReplace(pendingSwap[1].path.slice(1), userArray, pendingSwap[0].element);

    dispatch({
        type: SWAP_STACK,
        payload: newUserArray
    });
}