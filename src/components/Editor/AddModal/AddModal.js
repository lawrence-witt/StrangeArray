import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a } from 'react-spring';

import './AddModal.css';
import { useModal } from '../../../utils/CustomHooks';
import { addToStack } from '../../../redux/actions/stackActions';
import { setEditorState } from '../../../redux/actions/viewActions';
import TypeSelector from './TypeSelector/TypeSelector';
import InputSelector from './InputSelector/InputSelector';
import ErrorExtension from '../../ErrorExtension/ErrorExtension';

const dataSchema = {
    type: '',
    content: ''
};

const errorSchema = {
    active: false,
    message: ''
}

const AddModal = props => {
    const { opened } = props;
    const { addToStack, setEditorState } = props;

    /* INTERNAL STATE */
    const [modalStage, setModalStage] = useState('typeSelector');
    const [dataModel, setDataModel] = useState(dataSchema);
    const [inputError, setInputError] = useState(errorSchema);

    // Persists transition from type to input
    useEffect(() => {
        if(dataModel.type && modalStage === 'typeSelector') {
            setModalStage('inputSelector');
        }
    }, [dataModel]);

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, modalSpring] = useModal(opened, [], [
        function() {setModalStage('typeSelector')},
        function() {setDataModel(dataSchema)},
        function() {setInputError(errorSchema)}
    ], {});

    useEffect(() => {
        if(!opened){
            setModalStage('typeSelector');
            setInputError({...inputError, active: false});
        } 
    }, [opened]);

    return modalActive ? (
        <a.div className="editor-modal add-modal" style={modalSpring}>
            <div className={`selection-container ${inputError.active ? 'error' : ''}`}>
                <TypeSelector
                    dataSchema={dataSchema}
                    dataModel={dataModel}
                    setDataModel={setDataModel}
                    modalStage={modalStage}/>
                <InputSelector
                    dataModel={dataModel} 
                    setDataModel={setDataModel}
                    modalStage={modalStage}
                    setModalStage={setModalStage}
                    inputError={inputError}
                    setInputError={setInputError}
                    addToStack={addToStack}
                    setEditorState={setEditorState}/>
            </div>
            <ErrorExtension 
                errorObject={inputError}
                errorSetter={setInputError}/>
        </a.div>
    ) : null;
}

export default connect(null, { addToStack, setEditorState })(AddModal);