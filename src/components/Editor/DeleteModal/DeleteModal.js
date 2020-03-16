import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './DeleteModal.css';
import { usePrevious } from '../../../utils/CustomHooks';
import { resetDeletion } from '../../../redux/actions/viewActions';
import { removeFromStack } from '../../../redux/actions/stackActions';

const DeleteModal = props => {

    const { opened } = props;
    const { pendingDeletion, resetDeletion, removeFromStack } = props;

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, setModalActive] = useState(false);
    const [modalEntering, setModalEntering] = useState(false);
    const prevEntering = usePrevious(modalEntering);

    useEffect(() => {
        opened ? setModalEntering(true) : setModalEntering(false);
    }, [opened]);

    useEffect(() => {
        if(modalEntering) setModalActive(true);
    }, [modalEntering])

    const modalSpring = useSpring({
        transform: modalEntering ? 'translateY(0%)' : 'translateY(-100%)',
        onRest: () => {if(!modalEntering && prevEntering) {
            setModalActive(false);
            resetDeletion();
        }}
    });


    /* RESPOND TO CLICK EVENTS */
    const handleDeletion = () => {
        removeFromStack();
    }

    return modalActive ? (
        <a.div className="delete-modal" style={modalSpring}>
            <h2>Select An Element To Delete</h2>
            {pendingDeletion.element.type ? (
                <div className="delete-selection-container">
                    <p className="element-type">{pendingDeletion.element.type}</p>
                    <p className="element-content">{pendingDeletion.element.content}</p>
                    <button className="confirm-delete-btn" onClick={handleDeletion}>Confirm</button>
                </div>
            ): null}
        </a.div>
    ) : null;
}

const mapStateToProps = state => ({
    pendingDeletion: state.view.pendingDeletion
});

export default connect(mapStateToProps, { resetDeletion, removeFromStack })(DeleteModal);