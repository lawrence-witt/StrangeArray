import React, {useState} from 'react';
import { a, useSpring } from 'react-spring';

import ArraySelector from './Selectors/ArraySelector';
import ObjectSelector from './Selectors/ObjectSelector';
import StringSelector from './Selectors/StringSelector';
import BooleanSelector from './Selectors/BooleanSelector';
import NumberSelector from './Selectors/NumberSelector';
import NullSelector from './Selectors/NullSelector';

const selectors = {
    Array: ArraySelector,
    Object: ObjectSelector,
    String: StringSelector,
    Boolean: BooleanSelector,
    Number: NumberSelector,
    Null: NullSelector
}

const InputSelector = props => {
    const { dataModel, setDataModel, modalStage, setModalStage, addToStack, setEditorState} = props;

    const inputSpring = useSpring({
        transform: modalStage === 'inputSelector' ? 'translateX(0%)' : 'translateX(100%)'
    });

    const CurrentSelector = selectors[dataModel.element.type];

    return (
        <a.div className="input-container" style={inputSpring}>
            {CurrentSelector ? 
                <CurrentSelector 
                    dataModel={dataModel} 
                    setDataModel={setDataModel} 
                    setModalStage={setModalStage}
                    addToStack={addToStack}
                    setEditorState={setEditorState}/> 
            : null}
        </a.div>
    )
};

export default InputSelector;