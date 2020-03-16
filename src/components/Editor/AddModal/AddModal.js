import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './AddModal.css';
import { useModal } from '../../../utils/CustomHooks';
import { addToStack } from '../../../redux/actions/stackActions';
import { setEditorState } from '../../../redux/actions/viewActions';
import TypeSelector from './TypeSelector/TypeSelector';
import InputSelector from './InputSelector/InputSelector';

/* global BigInt */

const dataSchema = {
    element: {
        type: null, 
        content: null,
    },
    error: ''
};

const AddModal = props => {
    const { opened } = props;
    const { addToStack, setEditorState } = props;

    /* INTERNAL STATE */
    const [modalStage, setModalStage] = useState('typeSelector');
    const [dataModel, setDataModel] = useState(dataSchema);

    useEffect(() => {
        if(dataModel.element.type && modalStage === 'typeSelector') {
            setModalStage('inputSelector');
        }
    }, [dataModel]);

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, modalSpring] = useModal(opened, [
        function() {setModalStage('typeSelector')},
        function() {setDataModel(dataSchema)}
    ]);

    return modalActive ? (
        <a.div className="add-modal" style={modalSpring}>
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
                    addToStack={addToStack}
                    setEditorState={setEditorState}/>
        </a.div>
    ) : null;
}

export default connect(null, { addToStack, setEditorState })(AddModal);