import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring, useTransition } from 'react-spring';

import './Editor.css';
import DeleteModal from './DeleteModal/DeleteModal';
import AddModal from './AddModal/AddModal';
import FocusModal from './FocusModal/FocusModal';
import { startTransition, toggleDeletion, unfocusElements } from '../../redux/actions/viewActions';

const Editor = props => {
    const { focusActive, deletionActive, startTransition, toggleDeletion, unfocusElements} = props;
    const [editorActive, setEditorActive] = useState(false);
    const [addModal, toggleAddModal] = useState(false);
    const [deleteModal, toggleDeleteModal] = useState(false);
    const [focusModal, setFocusModal] = useState(false);

    useEffect(() => {
        setEditorActive(true);
    }, [])

    const addHandler = () => {
        toggleAddModal(!addModal);
        if(deleteModal) {
            toggleDeleteModal(false);
            toggleDeletion(false);
        };
        if(focusModal) unfocusElements();
    }

    const deleteHandler = () => {
        toggleDeleteModal(!deleteModal);
        if(addModal) toggleAddModal(false);
        if(focusModal) unfocusElements();
        if(deletionActive) {
            toggleDeletion(false);
        } else {
            toggleDeletion(true);
        }
    }

    // Focus Handler
    useEffect(() => {
        setFocusModal(focusActive);
        if(focusActive) {
            toggleAddModal(false);
            toggleDeleteModal(false);
        }
    }, [focusActive]);

    const exitHandler = async () => {
        setEditorActive(false);
        startTransition('home');
    }

    const buttonSpring = useSpring({transform: editorActive ? 'translateY(0%)' : 'translateY(200%)'});

    return (
        <div className="editor-container">
            <AddModal opened={addModal} addHandler={addHandler}/>
            <DeleteModal opened={deleteModal} deleteHandler={deleteHandler}/>
            <FocusModal opened={focusModal}/>
            <a.section className="e-buttons" style={buttonSpring}>
                <button className="e-button" onClick={addHandler}>Add</button>
                <button className="e-button" onClick={deleteHandler}>{deletionActive ? 'Cancel' : 'Delete'}</button>
                <button className="e-button">Swap</button>
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
    deletionActive: state.view.deletionActive
});

export default connect(mapStateToProps, { startTransition, toggleDeletion, unfocusElements })(Editor);