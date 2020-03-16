import React from 'react';

const NullSelector = props => {
    const { dataModel, setModalStage, addToStack, setEditorState } = props;

    const validateNull = () => {
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

            <button className="confirm-button" onClick={validateNull}>Confirm</button>
        </div>
        </>
    )
}

export default NullSelector;