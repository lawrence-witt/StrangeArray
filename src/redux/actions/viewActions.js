import { START_TRANSITION, PERSIST_TRANSITION, COMPLETE_TRANSITION, CLEAR_STACK, UPDATE_PATH} from './types';

export const startTransition = destination => dispatch => {

    dispatch({
        type: CLEAR_STACK
    });

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

    dispatch({
        type: COMPLETE_TRANSITION
    })
}