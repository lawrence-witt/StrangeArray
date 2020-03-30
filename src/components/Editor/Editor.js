import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './Editor.css';
import Plus from '../../assets/svgs/Plus';
import Minus from '../../assets/svgs/Minus';
import Swap from '../../assets/svgs/Swap';
import Download from '../../assets/svgs/Download';
import Sliders from '../../assets/svgs/Sliders';
import Back from '../../assets/svgs/Back';

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
    const modalHandler = mode => {
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
                <Plus 
                    className={`e-button ${editorState.add ? 'selected' : ''}`}
                    onClick={() => modalHandler('add')}/>
                <Minus 
                    className={`e-button ${editorState.remove ? 'selected' : ''}`}
                    onClick={() => modalHandler('remove')}/>
                <Swap 
                    className={`e-button ${editorState.swap ? 'selected' : ''}`}
                    onClick={() => modalHandler('swap')}/>
                <Download 
                    className={`e-button ${editorState.download ? 'selected' : ''}`} 
                    onClick={() => modalHandler('download')}/>
                <Sliders 
                    className={`e-button ${editorState.controls ? 'selected' : ''}`}
                    onClick={() => modalHandler('controls')}/>
                <Back 
                    className={'e-button'} 
                    onClick={e => {
                        exitHandler();
                        e.target.classList.add('selected');}}/>
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