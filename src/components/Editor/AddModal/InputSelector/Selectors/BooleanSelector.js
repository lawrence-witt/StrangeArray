import React from 'react';

const BooleanSelector = props => {
    const { dataModel, setDataModel, setModalStage, addToStack, setEditorState } = props;

    const validateBoolean = () => {
        const { content } = dataModel.element;
        try {
            if(!content) {
                throw new Error(`Please select a value.`);
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
                <select defaultValue="select" onChange={e => {
                    setDataModel({...dataModel, element: {
                        type: dataModel.element.type,
                        content: e.target.value
                    }})
                }}>
                    <option value="select" disabled>Select...</option>
                    <option value='True'>True</option>
                    <option value='False'>False</option>
                </select>
            </div>
        </div>
        <div className="input-button-container">
            <button className="reset-button" onClick={() => setModalStage('typeSelector')}>Reset</button>

            <button className="confirm-button" onClick={validateBoolean}>Confirm</button>
        </div>
        </>
    )
}

export default BooleanSelector;