import React from 'react';

const StringSelector = props => {
    const { dataModel, setDataModel} = props;

    return (
        <div className="input-data-container">
            <h2 className="input-title">Add: {dataModel.type}</h2>
            <div className="input-box">
                <textarea onChange={e => {setDataModel({...dataModel, content: e.target.value})}}></textarea>
            </div>
        </div>
    )
}

export default StringSelector;