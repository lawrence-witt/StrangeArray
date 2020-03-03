import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring, useTransition } from 'react-spring';

import './Editor.css';
import DeleteModal from './DeleteModal/DeleteModal';
import AddModal from './AddModal/AddModal';
import { startTransition, toggleDeletion } from '../../redux/actions/viewActions';

const Editor = props => {
    const { deletionActive, startTransition, toggleDeletion} = props;
    const [editorActive, setEditorActive] = useState(false);
    const [addModal, toggleAddModal] = useState(false);
    const [deleteModal, toggleDeleteModal] = useState(false);

    useEffect(() => {
        setEditorActive(true);
    }, [])

    const addHandler = () => {
        toggleAddModal(!addModal);
        if(deleteModal) {
            toggleDeleteModal(false);
            toggleDeletion(false);
        } 
    }

    const deleteHandler = () => {
        toggleDeleteModal(!deleteModal);
        if(addModal) toggleAddModal(false);
        if(deletionActive) {
            toggleDeletion(false);
        } else {
            toggleDeletion(true);
        }
    }

    const exitHandler = async () => {
        setEditorActive(false);
        startTransition('home');
    }

    const buttonSpring = useSpring({transform: editorActive ? 'translateY(0%)' : 'translateY(200%)'});
    

    return (
        <div className="editor-container">
            <AddModal opened={addModal} addHandler={addHandler}/>
            <DeleteModal opened={deleteModal} deleteHandler={deleteHandler}/>
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
    deletionActive: state.view.deletionActive
});

export default connect(mapStateToProps, { startTransition, toggleDeletion })(Editor);