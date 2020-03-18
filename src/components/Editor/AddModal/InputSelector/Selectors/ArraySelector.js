import React, { useContext } from 'react';

const ArraySelector = props => {
    const { dataModel, setModalStage, validator } = props;

    return (
        <div className="input-data-container">
            <h2 className="input-title">Add: {dataModel.type}</h2>
        </div>
    )
}

export default ArraySelector;