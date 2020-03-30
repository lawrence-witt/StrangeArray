import React from 'react';
import { a, useSpring } from 'react-spring';

import Back from '../../../../assets/svgs/Back';
import Checkmark from '../../../../assets/svgs/Checkmark';

import ArraySelector from './Selectors/ArraySelector';
import ObjectSelector from './Selectors/ObjectSelector';
import StringSelector from './Selectors/StringSelector';
import BooleanSelector from './Selectors/BooleanSelector';
import NumberSelector from './Selectors/NumberSelector';
import NullSelector from './Selectors/NullSelector';

const InputSelector = props => {
    const { dataModel, setDataModel, modalStage, setModalStage, inputError, setInputError, addToStack, setEditorState} = props;
    const { type, content } = dataModel;

    const inputSpring = useSpring({
        transform: modalStage === 'inputSelector' ? 'translateX(0%)' : 'translateX(100%)'
    });

    const validateObject = () => {
        try {
            if(!content) throw new Error('No text entered.');
            const parsedContent = JSON.parse(content);
            const parsedConstructor = parsedContent.constructor;
            if(parsedConstructor !== Object) {
                throw new Error(`Expected an Object Literal, recieved ${Array.isArray(parsedContent) ? 'array' : typeof parsedContent}.`);
            } else {
                submitDataModel();
            }
        } catch(e) {
            setInputError({active: true, message: e.message});
        }
    }

    const validateString = () => {
        try {
            if(!content) {
                throw new Error('Please enter at least one character.');
            } else {
                submitDataModel();
            }
        } catch(e) {
            setInputError({active: true, message: e.message});
        }
    }

    const validateBoolean = () => {
        try {
            if(!content) {
                throw new Error(`Please select a value.`);
            } else {
                submitDataModel();
            }
        } catch(e) {
            setInputError({active: true, message: e.message});
        }
    }

    const validateNumber = () => {
        try {
            if(!content) {
                throw new Error('Please enter a number.');
            } else if(isNaN(Number(content))){
                throw new Error('Please enter a valid number.');
            } else {
                submitDataModel();
            }
        } catch(e) {
            setInputError({active: true, message: e.message});
        }
    }

    const submitDataModel = () => {
        setInputError({...inputError, active: false});
        addToStack(dataModel);
        setEditorState('add');
    }

    const selectors = {
        Array: ArraySelector,
        Object: ObjectSelector,
        String: StringSelector,
        Boolean: BooleanSelector,
        Number: NumberSelector,
        Null: NullSelector
    }

    const validators = {
        Array: submitDataModel,
        Object: validateObject,
        String: validateString,
        Boolean: validateBoolean,
        Number: validateNumber,
        Null: submitDataModel
    }

    const CurrentSelector = selectors[dataModel.type];
    const currentValidator = validators[dataModel.type];

    return (
        <a.div className={`input-container ${type}`} style={inputSpring}>
            {CurrentSelector ? 
                <CurrentSelector 
                    dataModel={dataModel} 
                    setDataModel={setDataModel}/> 
            : null}
            <div className="input-button-container">
                <Back 
                    className="input-button"
                    onClick={() => {
                        setModalStage('typeSelector');
                        setInputError({...inputError, active: false});
                    }}/>
                <Checkmark 
                    className="input-button"
                    onClick={() => currentValidator()}/>
            </div>
        </a.div>
    )
};

export default InputSelector;