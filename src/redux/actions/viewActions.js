import { 
    START_TRANSITION, 
    PERSIST_TRANSITION, 
    COMPLETE_TRANSITION, 
    TOGGLE_DELETION,
    CLEAR_STACK } from './types';

export const startTransition = destination => dispatch => {

    dispatch({ type: CLEAR_STACK });

    dispatch({
        type: START_TRANSITION,
        payload: {
            destination
        }
    })
}

export const persistTransition = () => (dispatch, getState) => {
    const destination = getState().view.transitionDestination;

    dispatch({
        type: PERSIST_TRANSITION,
        payload: {
            destination
        }
    });
}

export const completeTransition = () => dispatch => {

    dispatch({ type: COMPLETE_TRANSITION });
}

export const toggleDeletion = newState => dispatch => {

    dispatch({ type: TOGGLE_DELETION, payload: newState });
}