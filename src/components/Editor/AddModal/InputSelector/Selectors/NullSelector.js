import React from 'react';

const NullSelector = props => {
    const { dataModel } = props;

    return (
        <div className="input-data-container">
            <h2 className="input-title">Add: {dataModel.type}</h2>
        </div>
    )
}

export default NullSelector;