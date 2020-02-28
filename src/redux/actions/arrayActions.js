import { ADD_TO_ARRAY, DELETE_FROM_ARRAY, INSERT_STACK } from './types';

export const addToArray = () => (dispatch, getState) => {
    const currentPath = getState().array.currentPath.slice();
    const userArray = getState().array.userArray.slice();
    const activeRoots = getState().stack.activeRoots.slice();
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
    const newUserArray = traverseAdd(currentPath, userArray, 'element');

    if (topRoot.length > 0) dispatch({ type: INSERT_STACK, payload: pathGen });
    
    dispatch({
        type: ADD_TO_ARRAY,
        payload: newUserArray
    })
}

export const deleteFromArray = path => (dispatch, getState) => {
    const userArray = getState().array.userArray.slice();
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
    
    dispatch({
        type: DELETE_FROM_ARRAY,
        payload: newUserArray
    })
}