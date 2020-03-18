import React from 'react';

const ObjectSelector = props => {
    const { dataModel, setDataModel } = props;

    return (
        <div className="input-data-container">
            <h2 className="input-title">Add: {dataModel.type}</h2>
            <div className="warning-container">
                <p>Expects an Object Literal in <a href="https://www.convertonline.io/convert/js-to-json" target="blank">JSON format</a>.</p>
            </div> 
            <div className="input-box">
                <textarea onChange={e => {setDataModel({...dataModel, content: e.target.value})}}></textarea>
            </div>
        </div>
    )
}

export default ObjectSelector;