import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './DownloadModal.css';
import { usePrevious } from '../../../utils/CustomHooks';

const DownloadModal = props => {
    const { opened } = props;
    const { rawUserArray } = props;
    const outputRef = useRef();

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, setModalActive] = useState(false);
    const [modalEntering, setModalEntering] = useState(false);
    const prevEntering = usePrevious(modalEntering);

    useEffect(() => {
        opened ? setModalEntering(true) : setModalEntering(false);
    }, [opened]);

    useEffect(() => {
        if(modalEntering) setModalActive(true);
    }, [modalEntering])

    const modalSpring = useSpring({
        transform: modalEntering ? 'translateY(0%)' : 'translateY(-100%)',
        onRest: () => {if(!modalEntering && prevEntering) {
            setModalActive(false);
        }}
    });

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