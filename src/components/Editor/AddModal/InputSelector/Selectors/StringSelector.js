import React from 'react';

const StringSelector = props => {
    const { dataModel, setDataModel, setModalStage, addToStack, setEditorState } = props;

    const validateString = () => {
        const { content } = dataModel.element;
        try {
            if(!content) {
                throw new Error('Please enter at least one character.');
            } else {
                addToStack(dataModel.element);
                setEditorState('add');
            }
        } catch(e) {
            setDataModel({...dataModel, error: e.message});
        }
    }

    return (
        <>
        <div className="input-data-container">
            <h2 className="input-title">Add: {dataModel.element.type}</h2>
            <div className="input-box">
                <textarea onChange={e => {
                    setDataModel({...dataModel, element: {
                        type: dataModel.element.type,
                        content: e.target.value
                    }})
                }}></textarea>
            </div>
        </div>
        <div className="input-button-container">
            <button className="reset-button" onClick={() => setModalStage('typeSelector')}>Reset</button>

            <button className="confirm-button" onClick={validateString}>Confirm</button>
        </div>
        </>
    )
}

export default StringSelector;