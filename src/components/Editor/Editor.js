import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './Editor.css';
import plus from '../../assets/svgs/plus.svg';
import minus from '../../assets/svgs/minus.svg';
import swap from '../../assets/svgs/swap.svg';
import download from '../../assets/svgs/download.svg';
import sliders from '../../assets/svgs/sliders.svg';
import back from '../../assets/svgs/back.svg';
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

    const buttonSpring = useSpring({
        transform: editorActive ? 'translateY(0%)' : 'translateY(200%)'
    });

    return (
        <div className="editor-container">
            <AddModal opened={editorState.add}/>
            <DeleteModal opened={editorState.remove}/>
            <SwapModal opened={editorState.swap}/>
            <DownloadModal opened={editorState.download}/>
            <ControlsModal opened={editorState.controls}/>
            <FocusModal opened={editorState.focus}/>
            <a.section className="e-buttons" style={buttonSpring}>
                <img 
                    className={`e-button ${editorState.add ? 'selected' : ''}`} 
                    src={plus} 
                    name="add"
                    onClick={modalHandler}></img>
                <img 
                    className={`e-button ${editorState.remove ? 'selected' : ''}`} 
                    src={minus} 
                    name="remove"
                    onClick={modalHandler}></img>
                <img 
                    className={`e-button ${editorState.swap ? 'selected' : ''}`} 
                    src={swap} 
                    name="swap"
                    onClick={modalHandler}></img>
                <img 
                    className={`e-button ${editorState.download ? 'selected' : ''}`} 
                    src={download} 
                    name="download"
                    onClick={modalHandler}></img>
                <img 
                    className={`e-button ${editorState.controls ? 'selected' : ''}`} 
                    src={sliders} 
                    name="controls"
                    onClick={modalHandler}></img>
                <img 
                    className={`e-button`} 
                    src={back} 
                    name="delete"
                    onClick={e => {
                        exitHandler();
                        e.target.classList.add('selected');
                    }}></img>
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