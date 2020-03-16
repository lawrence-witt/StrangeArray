import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './DownloadModal.css';
import { useModal } from '../../../utils/CustomHooks';

const DownloadModal = props => {
    const { opened } = props;
    const { rawUserArray } = props;
    const outputRef = useRef();

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, modalSpring] = useModal(opened, []);

    /* COPY */
    const copyToClipboard = () => {
        navigator.clipboard.writeText(outputRef.current.innerHTML);
        // Set some copied state and animation
    }

    return modalActive ? (
        <a.div className="download-modal" style={modalSpring}>
            <div className="array-container">
                <p ref={outputRef} className="array-output">{rawUserArray}</p>
            </div>
            <div className="download-button-container">
                <button className="download-button" onClick={copyToClipboard}>Copy</button>
            </div>
        </a.div>
    ) : null;
}

const mapStateToProps = state => ({
    rawUserArray: state.stack.rawUserArray
});

export default connect(mapStateToProps)(DownloadModal);