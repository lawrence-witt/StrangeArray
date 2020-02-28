import { ADD_TO_ARRAY, INSERT_STACK } from './types';

export const addToArray = () => (dispatch, getState) => {
    let currentPath = getState().array.currentPath.slice();
    let userArray = getState().array.userArray.slice();
    const activeRoots = getState().stack.activeRoots;
    const topFieldLayer = getState().stack.topFieldLayer;
    const topRoot = getState().stack.topRoot;

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

    // Note: before implementing this, fix the existing path bug with newly added cubes
    // This is a glaring bug - we are currently using path length to manage their placement in the redux store but this only works for single digit indexes.
    const pathGen = activeRoots.length <= 1 ? 'base' + (userArray.length).toString() : topRoot + (topFieldLayer.length).toString();

    const newUserArray = traverseAdd(currentPath, userArray, 'element');

    //if (topRoot !== '') dispatch({ type: INSERT_STACK, payload: pathGen });
    
    dispatch({
        type: ADD_TO_ARRAY,
        payload: newUserArray
    })
}