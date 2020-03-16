import React from 'react';

const ObjectSelector = props => {
    const { dataModel, setDataModel, setModalStage, addToStack, setEditorState } = props;

    const validateObject = () => {
        const { content } = dataModel.element;
        try {
            if(!content) throw new Error('No text entered.');
            const parsedContent = JSON.parse(content);
            const parsedConstructor = parsedContent.constructor;
            if(parsedConstructor !== Object) {
                throw new Error(`Expected an Object Literal, recieved ${parsedConstructor}.`);
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
            <div className="warning-container">
                <p>Expects an Object Literal in valid <a href="https://www.convertonline.io/convert/js-to-json" target="blank">JSON format</a>.</p>
            </div> 
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

            <button className="confirm-button" onClick={validateObject}>Confirm</button>
        </div>
        </>
    )
}

export default ObjectSelector;