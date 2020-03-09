import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring, useTransition } from 'react-spring';

import './Editor.css';
import AddModal from './AddModal/AddModal';
import DeleteModal from './DeleteModal/DeleteModal';
import FocusModal from './FocusModal/FocusModal';
import SwapModal from './SwapModal/SwapModal';
import { startTransition, toggleDeletion, unfocusElements, toggleSwap } from '../../redux/actions/viewActions';

const Editor = props => {
    const { focusActive, deletionActive, startTransition, toggleDeletion, unfocusElements, toggleSwap, swapActive} = props;

    const [editorActive, setEditorActive] = useState(false);
    const [addModal, toggleAddModal] = useState(false);
    const [deleteModal, toggleDeleteModal] = useState(false);
    const [focusModal, toggleFocusModal] = useState(false);
    const [swapModal, toggleSwapModal] = useState(false);

    useEffect(() => {
        setEditorActive(true);
    }, [])

    // Add Modal Handler
    const addHandler = () => {
        toggleAddModal(!addModal);
        if(deleteModal) {
            toggleDeleteModal(false);
            toggleDeletion(false);
        };
        if(focusModal) unfocusElements();
        if(swapModal) {
            toggleSwapModal(false);
            toggleSwap(false);
        };
    }

    // Delete Modal Handler
    const deleteHandler = () => {
        toggleDeleteModal(!deleteModal);
        toggleDeletion(!deletionActive);
        if(addModal) toggleAddModal(false);
        if(focusModal) unfocusElements();
        if(swapModal) {
            toggleSwapModal(false);
            toggleSwap(false);
        };
    }

    // Focus Modal Handler
    useEffect(() => {
        toggleFocusModal(focusActive);
        if(focusActive) {
            toggleAddModal(false);
            toggleDeleteModal(false);
            toggleSwapModal(false);
        };
    }, [focusActive]);

    // Swap Modal Handler
    const swapHandler = () => {
        toggleSwapModal(!swapModal);
        toggleSwap(!swapActive);
        if(addModal) toggleAddModal(false);
        if(deleteModal) {
            toggleDeleteModal(false);
            toggleDeletion(false);
        };
        if(focusModal) unfocusElements();
    }

    const exitHandler = () => {
        setEditorActive(false);
        if(addModal) toggleAddModal(false);
        if(deleteModal) {
            toggleDeleteModal(false);
            toggleDeletion(false);
        };
        if(focusModal) unfocusElements();
        if(swapModal) {
            toggleSwapModal(false);
            toggleSwap(false);
        }
        startTransition('home');
    }

    const buttonSpring = useSpring({transform: editorActive ? 'translateY(0%)' : 'translateY(200%)'});

    return (
        <div className="editor-container">
            <AddModal opened={addModal} addHandler={addHandler}/>
            <DeleteModal opened={deleteModal} deleteHandler={deleteHandler}/>
            <FocusModal opened={focusModal}/>
            <SwapModal opened={swapModal}/>
            <a.section className="e-buttons" style={buttonSpring}>
                <button className="e-button" onClick={addHandler}>{addModal ? 'Cancel' : 'Add'}</button>
                <button className="e-button" onClick={deleteHandler}>{deletionActive ? 'Cancel' : 'Delete'}</button>
                <button className="e-button" onClick={swapHandler}>{swapActive ? 'Cancel' : 'Swap'}</button>
                <button className="e-button">Download</button>
                <button className="e-button" onClick={exitHandler}>Exit</button>
            </a.section>
        </div>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    focusActive: state.view.focusActive,
    focussedElement: state.view.focussedElement,
    deletionActive: state.view.deletionActive,
    swapActive: state.view.swapActive,
});

export default connect(mapStateToProps, { startTransition, toggleDeletion, unfocusElements, toggleSwap })(Editor);