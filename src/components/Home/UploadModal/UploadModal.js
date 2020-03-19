import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a } from 'react-spring';

import './UploadModal.css';
import checkmark from '../../../assets/svgs/checkmark.svg';
import ErrorExtension from '../../ErrorExtension/ErrorExtension';
import { useModal } from '../../../utils/CustomHooks';
import { setCustomUserArray } from '../../../redux/actions/stackActions';

const errorSchema = {
    active: false,
    message: ''
}

const UploadModal = props => {
    const { opened } = props;
    const { setCustomUserArray } = props;
    const [userInput, setUserInput] = useState('');
    const [inputError, setInputError] = useState(errorSchema);

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, modalSpring] = useModal(opened, [], [
        function() {setUserInput('')},
        function() {setInputError(errorSchema)}
    ], {});

    useEffect(() => {
        if(!opened) setInputError({...inputError, active: false});
    }, [opened]);

    /* HANDLE INPUT */
    const validateAndSubmit = () => {
        try {
            if(!userInput) throw new Error('No text entered.');
            const parsed = JSON.parse(userInput);
            if(!Array.isArray(parsed)){
                throw new Error(`Expected an array, recieved ${typeof parsed}.`);
            } else if(parsed.length === 0) {
                throw new Error('Array must have length greater than 0.') 
            } else {
                setInputError({...inputError, active: false});
                setCustomUserArray(parsed);
            }
        } catch(e) {
            setInputError({active: true, message: e.message});
        }
    }

    return modalActive ? (
        <a.div className="upload-modal" style={modalSpring}>
            <div className={`upload-container ${inputError.active ? 'error' : ''}`}>

                <p className="upload-warning-container">Expects an Array in <a href="https://www.convertonline.io/convert/js-to-json" target="blank">JSON format</a>.</p>

                <textarea className="upload-input" onChange={e => setUserInput(e.target.value)}></textarea>

                <div className="upload-button-container">
                    <img 
                        className="swap-button"
                        src={checkmark} 
                        onClick={validateAndSubmit}></img>
                </div>

            </div>
            <ErrorExtension 
                errorObject={inputError} 
                errorSetter={setInputError}/>
        </a.div>
    ) : null;
}

const mapStateToProps = state => ({
    pendingSwap: state.view.pendingSwap
});

export default connect(mapStateToProps, { setCustomUserArray })(UploadModal);