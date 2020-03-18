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
            if(dataModel.type && modalStage === 'typeSelector' && prevModalStage === 'inputSelector') {
                setDataModel(dataSchema);
            }
        }
    });

    return (
        <a.div className={`type-container`} style={typeSpring}>
            {types.map(type => {
                return <span className={`type-button`} key={type}
                        onClick={() => {
                            setDataModel({...dataModel, type});
                        }}
                        onPointerEnter={e => e.target.classList.add(type)}
                        onPointerLeave={e => e.target.classList.remove(type)}
                        >{type}</span>
            })}
        </a.div>
    )
};

export default TypeSelector;