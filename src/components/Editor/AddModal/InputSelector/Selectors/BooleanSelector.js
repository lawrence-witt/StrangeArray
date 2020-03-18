import React from 'react';

const BooleanSelector = props => {
    const { dataModel, setDataModel } = props;
    const { type, content } = dataModel;

    return (
        <div className="input-data-container">
            <h2 className="input-title">Add: {type}</h2>
            <div className="input-box">
                <button 
                className={`bool-button ${content === 'True' ? 'selected' : ''}`} 
                value="True" 
                onClick={e => {setDataModel({...dataModel, content: e.target.value})}}>True</button>
                <button 
                className={`bool-button ${content === 'False' ? 'selected' : ''}`} 
                value="False" 
                onClick={e => {setDataModel({...dataModel, content: e.target.value})}}>False</button>
            </div>
        </div>
    )
}

export default BooleanSelector;