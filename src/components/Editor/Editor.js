import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './Editor.css';
import AddModal from './AddModal/AddModal';
import DeleteModal from './DeleteModal/DeleteModal';
import FocusModal from './FocusModal/FocusModal';
import SwapModal from './SwapModal/SwapModal';
import DownloadModal from './DownloadModal/DownloadModal';
import ControlsModal from './ControlsModal/ControlsModal';
import { startTransition, setUserUpload, setEditorState } from '../../redux/actions/viewActions';
import { setRawUserArray } from '../../redux/actions/stackActions';

const Editor = props => {
    const { startTransition, setUserUpload, editorState, setEditorState, setRawUserArray} = props;

    const [editorActive, setEditorActive] = useState(false);

    // On Mount
    useEffect(() => {
        setEditorActive(true);
        setUserUpload(false);
    }, []);

    // Modal Handler
    const modalHandler = e => {
        const mode = e.target.name;
        if(mode === 'download') setRawUserArray();
        setEditorState(mode);
    }

    // Exit Handler
    const exitHandler = () => {
        setEditorActive(false);
        setEditorState(null);
        startTransition('home');
    }

    const buttonSpring = useSpring({transform: editorActive ? 'translateY(0%)' : 'translateY(200%)'});

    return (
        <div className="editor-container">
            <AddModal opened={editorState.add}/>
            <DeleteModal opened={editorState.delete}/>
            <SwapModal opened={editorState.swap}/>
            <DownloadModal opened={editorState.download}/>
            <ControlsModal opened={editorState.controls}/>
            <FocusModal opened={editorState.focus}/>
            <a.section className="e-buttons" style={buttonSpring}>
                <button className="e-button" name="add" onClick={modalHandler}>{editorState.add ? 'Cancel' : 'Add'}</button>
                <button className="e-button" name="delete" onClick={modalHandler}>{editorState.delete ? 'Cancel' : 'Delete'}</button>
                <button className="e-button" name="swap" onClick={modalHandler}>{editorState.swap ? 'Cancel' : 'Swap'}</button>
                <button className="e-button" name="download" onClick={modalHandler}>{editorState.download ? 'Cancel' : 'Download'}</button>
                <button className="e-button" name="controls" onClick={modalHandler}>{editorState.controls ? 'Cancel' : 'Controls'}</button>
                <button className="e-button" onClick={exitHandler}>Exit</button>
            </a.section>
        </div>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    focussedElement: state.view.focussedElement,
    editorState: state.view.editorState
});

export default connect(mapStateToProps, { 
    startTransition, setUserUpload, setEditorState, setRawUserArray
})(Editor);