import { 
    START_TRANSITION, 
    PERSIST_TRANSITION, 
    COMPLETE_TRANSITION, 
    START_DELETION, 
    END_DELETION,
    
    UPDATE_PATH,

    CLEAR_STACK } from './types';

export const startTransition = destination => dispatch => {

    dispatch({ type: CLEAR_STACK });

    dispatch({
        type: UPDATE_PATH,
        payload: []
    })

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

export const startDeletion = () => dispatch => {

    dispatch({ type: START_DELETION });
}

export const endDeletion = () => dispatch => {

    dispatch({ type: END_DELETION });
}