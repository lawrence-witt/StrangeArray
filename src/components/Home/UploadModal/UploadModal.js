import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './UploadModal.css';
import { usePrevious } from '../../../utils/CustomHooks';
import { setCustomUserArray } from '../../../redux/actions/stackActions';

const UploadModal = props => {
    const { opened } = props;
    const { setCustomUserArray } = props;
    const [userInput, setUserInput] = useState(null);
    const [inputError, setInputError] = useState(null);

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
            setUserInput(null);
            setInputError(null);
        }}
    });

    /* HANDLE INPUT */
    const validateAndSubmit = () => {
        try {
            const parsed = JSON.parse(userInput);
            if(!Array.isArray(parsed)){
                throw new Error('Expected an array.');
            } else if(parsed.length === 0) {
                throw new Error('Array must have length greater than 0.') 
            } else {
                setInputError(null);
                setCustomUserArray(parsed);
            }
        } catch(e) {
            setInputError(e.message);
        }
    }

    return modalActive ? (
        <a.div className="upload-modal" style={modalSpring}>
            <div className="upload-container">

                <p className="upload-warning-container">Expects an Array in valid <a href="https://www.convertonline.io/convert/js-to-json" target="blank">JSON format</a>.</p>

                {inputError ? <p className="upload-error-container">{inputError}</p> : null}

                <textarea className="upload-input" onChange={e => setUserInput(e.target.value)}></textarea>

                <div className="upload-button-container">
                    <button className="upload-button" onClick={validateAndSubmit}>Confirm</button>
                </div>

            </div>
        </a.div>
    ) : null;
}

const mapStateToProps = state => ({
    pendingSwap: state.view.pendingSwap
});

export default connect(mapStateToProps, { setCustomUserArray })(UploadModal);