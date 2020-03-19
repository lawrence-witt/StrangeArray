import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './DeleteModal.css';
import checkmark from '../../../assets/svgs/checkmark.svg';
import { useModal } from '../../../utils/CustomHooks';
import { resetDeletion } from '../../../redux/actions/viewActions';
import { removeFromStack } from '../../../redux/actions/stackActions';

const DeleteModal = props => {
    const { opened } = props;
    const { pendingDeletion, resetDeletion, removeFromStack } = props;
    const { type, content } = pendingDeletion.element;

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const heightProps = {
        height: type ? '25%' : '0%'
    };

    const [modalActive, modalSpring] = useModal(opened, [resetDeletion], [resetDeletion], heightProps);


    /* RESPOND TO CLICK EVENTS */
    const handleDeletion = () => {
        removeFromStack();
    }

    return modalActive ? (
        <a.div className={`editor-modal delete-modal ${type}`} style={modalSpring}>
            <h2 className="delete-title">Select An Element To Delete:</h2>

            {type ? (
            <>
            <div className="delete-selection-container">
                <p className="element-type">{type}</p>
                <p className="element-content">{content}</p>
            </div>
            <div className="delete-button-container">
                <img 
                    className="delete-button"
                    src={checkmark} 
                    onClick={handleDeletion}></img>
            </div>
            </>
            ): null}
        </a.div>
    ) : null;
}

const mapStateToProps = state => ({
    pendingDeletion: state.view.pendingDeletion
});

export default connect(mapStateToProps, { resetDeletion, removeFromStack })(DeleteModal);