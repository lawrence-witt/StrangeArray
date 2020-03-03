import React from 'react';
import { a, useSpring } from 'react-spring';

import { usePrevious } from '../../../../utils/CustomHooks';

const TypeSelector = props => {
    const { dataModel, setDataModel, modalStage } = props;

    const prevModalStage = usePrevious(modalStage);

    const types = {
        "Array": null,
        "Object": "textArea",
        "String": "textArea",
        "Boolean": "boolSelect",
        "Number": "text",
        "BigInt": "bigIntText",
        "Null": null,
        "Undefined": null
    }

    const typeSpring = useSpring({
        transform: modalStage === 'typeSelector' ? 'translateX(0%)' : 'translateX(-100%)',
        onRest: () => {
            if(dataModel.type && modalStage === 'typeSelector' && prevModalStage === 'inputSelector') {
                setDataModel({type: null, input: null, content: null, error: ''})
            }
        }
    });

    return (
        <a.div className="type-container" style={typeSpring}>
            {Object.keys(types).map(key => {
                return <button
                        className="type-button"
                        key={key}
                        onClick={() => {
                            setDataModel({...dataModel, type: key, input: types[key]});
                        }}>
                        {key}
                        </button>
            })}
        </a.div>
    )
};

export default TypeSelector;