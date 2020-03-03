import React, {useState} from 'react';
import { a, useSpring } from 'react-spring';

const InputSelector = props => {
    const { dataModel, setDataModel, modalStage, setModalStage, validateSubmission} = props;

    const inputSpring = useSpring({
        transform: modalStage === 'inputSelector' ? 'translateX(0%)' : 'translateX(100%)'
    });

    const handleInput = newInput => {
        setDataModel({...dataModel, content: newInput});
    }

    return (
        <a.div className="input-container" style={inputSpring}>

            <div className="input-data-container">
                <h2 className="input-title">Add: {dataModel.type}</h2>

                {dataModel.type === 'Object' ? ( 
                    <div className="warning-container">
                        <p>Expects an Object Literal in valid <a href="https://www.convertonline.io/convert/js-to-json" target="blank">JSON format</a>.</p>
                        <p>{dataModel.error}</p>
                    </div> ) : 
                dataModel.type === 'Number' || dataModel.type === 'BigInt' ? (
                    <div className="warning-container">
                        <p>{dataModel.error}</p>
                    </div> ): null}

                <div className="input-box">
                    {dataModel.input === 'textArea' ? 
                        <textarea onChange={(e) => {
                            handleInput(e.target.value)
                        }}></textarea> :
                    dataModel.input === 'text' ?
                        <input type="text" onChange={(e) => {
                            handleInput(e.target.value)
                        }}></input> :
                    dataModel.input === 'bigIntText' ?
                        <span><input type="text" onChange={(e) => {
                            handleInput(e.target.value)
                        }}></input>n</span> :
                    dataModel.input === 'boolSelect' ?
                        <select defaultValue="select" onChange={(e) => {
                            handleInput(e.target.value)
                        }}>
                            <option value="select" disabled>Select...</option>
                            <option value={'true'}>True</option>
                            <option value={'false'}>False</option>
                        </select> : null}
                </div>

            </div>

            <div className="input-button-container">
                <button className="reset-button" onClick={() => setModalStage('typeSelector')}>
                Reset
                </button>

                <button className="confirm-button" onClick={validateSubmission}>
                Confirm
                </button>
            </div>

        </a.div>
    )
};

export default InputSelector;