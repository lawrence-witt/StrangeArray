import React from 'react';

const NumberSelector = props => {
    const { dataModel, setDataModel } = props;

    return (
        <div className="input-data-container">
            <h2 className="input-title">Add: {dataModel.type}</h2>
            <div className="input-box">
                <input className="number-input" type="text" onChange={e => {setDataModel({...dataModel, content: e.target.value})}}></input>
            </div>
        </div>
    )
}

export default NumberSelector;