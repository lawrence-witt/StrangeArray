import React, { useContext } from 'react';

const ArraySelector = props => {
    const { dataModel, setModalStage, addToStack, setEditorState } = props;

    const validateArray = () => {
        addToStack(dataModel.element);
        setEditorState('add');
    }

    return (
        <>
        <div className="input-data-container">
            <h2 className="input-title">Add: {dataModel.element.type}</h2>
        </div>
        <div className="input-button-container">
            <button className="reset-button" onClick={() => setModalStage('typeSelector')}>Reset</button>

            <button className="confirm-button" onClick={validateArray}>Confirm</button>
        </div>
        </>
    )
}

export default ArraySelector;