import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './AddModal.css';
import { usePrevious } from '../../../utils/CustomHooks';
import { addToStack } from '../../../redux/actions/stackActions';
import TypeSelector from './TypeSelector/TypeSelector';
import InputSelector from './InputSelector/InputSelector';
import { setEditorState } from '../../../redux/actions/viewActions';

/* global BigInt */

const AddModal = props => {
    const { opened, setEditorState } = props;
    const { addToStack } = props;

    /* INTERNAL STATE */
    const [modalStage, setModalStage] = useState('typeSelector');
    const [dataModel, setDataModel] = useState({
        type: null, 
        input: null, 
        content: null,
        error: ''
    });

    useEffect(() => {
        if(dataModel.type && modalStage === 'typeSelector') {
            setModalStage('inputSelector');
        }
    }, [dataModel]);

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
            setModalStage('typeSelector');
            setDataModel({type: null, input: null, content: null, error: ''});
        }}
    });

    /* VALIDATION AND SUBMISSION */
    const validateSubmission = () => {
        let validated = false;
        let submitModel = {
            type: dataModel.type,
            content: dataModel.content
        };

        switch(submitModel.type) {
            case 'Object':
                if(!submitModel.content) return;
                try {
                    const content = JSON.parse(submitModel.content);
                    if (content.constructor !== Object){
                        throw new Error('Expected an Object Literal.');
                    } else {
                        setDataModel({...dataModel, error: ''});
                        validated = true;
                    }
                } catch(error) {
                    setDataModel({...dataModel, error: error.message});
                    return;
                }
                break;
            case 'BigInt':
            case 'Number':
                if(!submitModel.content) return;
                const validNumber = Number(submitModel.content);
                if(validNumber) {
                    setDataModel({...dataModel, error: ''});
                    validated = true;
                    if (submitModel.type === 'BigInt') {
                        submitModel.content = BigInt(validNumber);
                    } else {
                        submitModel.content = validNumber;
                    }
                } else {
                    setDataModel({...dataModel, error: 'Please enter a valid number.'});
                }
                break;
            case 'Boolean':
                if(!submitModel.content) {
                    return;
                } else {
                    validated = true;
                }
                break;
            case null:
                return;
            default:
                validated = true;
        }

        if (validated) {
            setEditorState('add');
            addToStack(submitModel);
        }
    }

    return modalActive ? (
        <a.div className="add-modal" style={modalSpring}>
            <TypeSelector
                dataModel={dataModel}
                setDataModel={setDataModel}
                modalStage={modalStage}/>
            <InputSelector
                dataModel={dataModel} 
                setDataModel={setDataModel}
                modalStage={modalStage}
                setModalStage={setModalStage}
                validateSubmission={validateSubmission}/>
        </a.div>
    ) : null;
}

export default connect(null, { addToStack, setEditorState })(AddModal);