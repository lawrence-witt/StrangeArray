import React from 'react';
import { a, useSpring } from 'react-spring';

import { usePrevious } from '../../../../utils/CustomHooks';

const TypeSelector = props => {
    const { dataSchema, dataModel, setDataModel, modalStage } = props;

    const prevModalStage = usePrevious(modalStage);

    const types = ['Array', 'Object', 'String', 'Boolean', 'Number', 'Null'];

    const typeSpring = useSpring({
        transform: modalStage === 'typeSelector' ? 'translateX(0%)' : 'translateX(-100%)',
        onRest: () => {
            if(dataModel.element.type && modalStage === 'typeSelector' && prevModalStage === 'inputSelector') {
                setDataModel(dataSchema);
            }
        }
    });

    return (
        <a.div className="type-container" style={typeSpring}>
            {types.map(type => {
                return <button className="type-button" key={type}
                        onClick={() => {
                            setDataModel({...dataModel, element:{
                                type,
                                content: null
                            }});
                        }}>{type}</button>
            })}
        </a.div>
    )
};

export default TypeSelector;