import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './DeleteModal.css';
import { useModal } from '../../../utils/CustomHooks';
import { resetDeletion } from '../../../redux/actions/viewActions';
import { removeFromStack } from '../../../redux/actions/stackActions';

const DeleteModal = props => {

    const { opened } = props;
    const { pendingDeletion, resetDeletion, removeFromStack } = props;

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, modalSpring] = useModal(opened, [resetDeletion]);

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