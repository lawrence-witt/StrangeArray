import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './DownloadModal.css';
import copy from '../../../assets/svgs/copy.svg';
import { useModal } from '../../../utils/CustomHooks';

const DownloadModal = props => {
    const { opened } = props;
    const { rawUserArray } = props;
    const outputRef = useRef();

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, modalSpring] = useModal(opened, [], [], {});

    /* COPY */
    const [notice, setNotice] = useState({active: false, entering: false});

    const copyToClipboard = () => {
        navigator.clipboard.writeText(outputRef.current.innerHTML);
        setNotice({active: true, entering: true});
    }

    // This is currently stopping the component contents from unmounting
    const noticeSpring = useSpring({
        opacity: notice.entering ? 1 : 0,
        bottom: notice.active ? '-2rem' : '-1rem',
        onRest: () => {
            if(notice.active && notice.entering) {
                setNotice({...notice, entering: false});
            } else {
                setNotice({...notice, active: false});
            }
        }
    })

    return modalActive ? (
        <a.div className="editor-modal download-modal" style={modalSpring}>
            <div className="download-content-container">
                <div className="array-container">
                    <p ref={outputRef} className="array-output">{rawUserArray}</p>
                </div>
                <div className="download-button-container">
                    <img 
                        className="download-button"
                        src={copy} 
                        onClick={copyToClipboard}></img>
                </div>
            </div>
            {notice.active ? <a.p className="copy-notice" style={noticeSpring}>Copied.</a.p> : null}
        </a.div>
    ) : null;
}

const mapStateToProps = state => ({
    rawUserArray: state.stack.rawUserArray
});

export default connect(mapStateToProps)(DownloadModal);