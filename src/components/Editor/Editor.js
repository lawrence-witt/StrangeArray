import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring, useTransition } from 'react-spring';

import './Editor.css';
import AddModal from './AddModal/AddModal';
import DeleteModal from './DeleteModal/DeleteModal';
import FocusModal from './FocusModal/FocusModal';
import SwapModal from './SwapModal/SwapModal';
import DownloadModal from './DownloadModal/DownloadModal';
import ControlsModal from './ControlsModal/ControlsModal';
import { startTransition, setUserUpload, toggleDeletion, unfocusElements, toggleSwap, toggleDownload, toggleControls } from '../../redux/actions/viewActions';
import { setRawUserArray } from '../../redux/actions/stackActions';

const Editor = props => {
    const { focusActive, deletionActive, startTransition, setUserUpload, toggleDeletion, unfocusElements, toggleSwap, swapActive, setRawUserArray, downloadActive, toggleDownload, toggleControls, controlsActive} = props;

    const [editorActive, setEditorActive] = useState(false);
    const [focusModal, toggleFocusModal] = useState(false);
    const [addModal, toggleAddModal] = useState(false);
    const [deleteModal, toggleDeleteModal] = useState(false);
    const [swapModal, toggleSwapModal] = useState(false);
    const [downloadModal, toggleDownloadModal] = useState(false);
    const [controlsModal, toggleControlsModal] = useState(false);

    // On Mount
    useEffect(() => {
        setEditorActive(true);
        setUserUpload(false);
    }, []);

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
        if(downloadModal) {
            toggleDownload(false)
            toggleDownloadModal(false);
        }
        if(controlsModal) {
            toggleControlsModal(false);
            toggleControls(false);
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
        if(downloadModal) {
            toggleDownload(false)
            toggleDownloadModal(false);
        }
        if(controlsModal) {
            toggleControlsModal(false);
            toggleControls(false);
        };
    }

    // Focus Modal Handler
    useEffect(() => {
        toggleFocusModal(focusActive);
        if(focusActive) {
            toggleAddModal(false);
            toggleDeleteModal(false);
            toggleDeletion(false);
            toggleSwapModal(false);
            toggleSwap(false);
            toggleDownloadModal(false);
            toggleDownload(false);
            toggleControlsModal(false);
            toggleControls(false);
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
        if(downloadModal) {
            toggleDownload(false)
            toggleDownloadModal(false);
        }
        if(controlsModal) {
            toggleControlsModal(false);
            toggleControls(false);
        };
        if(focusModal) unfocusElements();
    }

    // Download Modal Handler
    const downloadHandler = () => {
        if(downloadModal) {
            toggleDownload(false)
            toggleDownloadModal(false);
        } else {
            setRawUserArray();
        }
    }

    useEffect(() => {
        if(downloadActive){
            toggleDownloadModal(true);
            if(addModal) toggleAddModal(false);
            if(deleteModal) {
                toggleDeleteModal(false);
                toggleDeletion(false);
            };
            if(focusModal) unfocusElements();
            if(controlsModal) {
                toggleControlsModal(false);
                toggleControls(false);
            };
            if(swapModal) {
                toggleSwapModal(false);
                toggleSwap(false);
            };
        }
    }, [downloadActive]);

    // Controls Modal Handler
    const controlsHandler = () => {
        toggleControlsModal(!controlsModal);
        toggleControls(!controlsActive);
        if(addModal) toggleAddModal(false);
        if(deleteModal) {
            toggleDeleteModal(false);
            toggleDeletion(false);
        };
        if(swapModal) {
            toggleSwapModal(false);
            toggleSwap(false);
        };
        if(downloadModal) {
            toggleDownload(false)
            toggleDownloadModal(false);
        }
        if(focusModal) unfocusElements();
    }

    // Exit Handler
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
        };
        if(controlsModal) {
            toggleControlsModal(false);
            toggleControls(false);
        };
        startTransition('home');
    }

    const buttonSpring = useSpring({transform: editorActive ? 'translateY(0%)' : 'translateY(200%)'});

    return (
        <div className="editor-container">
            <AddModal opened={addModal} addHandler={addHandler}/>
            <DeleteModal opened={deleteModal} deleteHandler={deleteHandler}/>
            <SwapModal opened={swapModal}/>
            <DownloadModal opened={downloadModal}/>
            <ControlsModal opened={controlsModal}/>
            <FocusModal opened={focusModal}/>
            <a.section className="e-buttons" style={buttonSpring}>
                <button className="e-button" onClick={addHandler}>{addModal ? 'Cancel' : 'Add'}</button>
                <button className="e-button" onClick={deleteHandler}>{deletionActive ? 'Cancel' : 'Delete'}</button>
                <button className="e-button" onClick={swapHandler}>{swapActive ? 'Cancel' : 'Swap'}</button>
                <button className="e-button" onClick={downloadHandler}>Download</button>
                <button className="e-button" onClick={controlsHandler}>Controls</button>
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
    downloadActive: state.view.downloadActive,
    controlsActive: state.view.controlsActive
});

export default connect(mapStateToProps, { startTransition, setUserUpload, toggleDeletion, unfocusElements, toggleSwap, setRawUserArray, toggleDownload, toggleControls })(Editor);