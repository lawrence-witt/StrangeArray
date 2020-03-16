import React from 'react';

const NumberSelector = props => {
    const { dataModel, setDataModel, setModalStage, addToStack, setEditorState } = props;

    const validateNumber = () => {
        const { content } = dataModel.element;
        try {
            if(!content) {
                throw new Error('Please enter a number.');
            } else if(isNaN(Number(content))){
                throw new Error('Please enter a valid number.');
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
                <input type="text" onChange={e => {
                    setDataModel({...dataModel, element: {
                        type: dataModel.element.type,
                        content: e.target.value
                    }})
                }}></input>
            </div>
        </div>
        <div className="input-button-container">
            <button className="reset-button" onClick={() => setModalStage('typeSelector')}>Reset</button>

            <button className="confirm-button" onClick={validateNumber}>Confirm</button>
        </div>
        </>
    )
}

export default NumberSelector;