import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a } from 'react-spring';

import './ControlsModal.css';
import { updateUnitPadding, updateLayerPadding } from '../../../redux/actions/stackActions';
import { useModal, useDebounce } from '../../../utils/CustomHooks';

const ControlsModal = props => {
    const { opened } = props;
    const { unitPadPerc, layerPadPerc, updateUnitPadding, updateLayerPadding } = props;

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, modalSpring] = useModal(opened, [], [], {});

    /* SLIDERS */
    const [slideState, setSlideState] = useState({
        unit: null,
        layer: null
    });

    const debouncedUnit = useDebounce(slideState.unit, 250);
    const debouncedLayer = useDebounce(slideState.layer, 250);

    const handleSlider = e => {
        e.stopPropagation();

        setSlideState({
            ...slideState,
            [e.target.name]: Number(e.target.value)
        });
    };

    useEffect(() => {
        if(debouncedUnit !== null) updateUnitPadding(debouncedUnit);
    }, [debouncedUnit]);

    useEffect(() => {
        if(debouncedLayer != null) updateLayerPadding(debouncedLayer);
    }, [debouncedLayer]);

    return modalActive ? (
        <a.div className="editor-modal controls-modal" style={modalSpring}>
            <div className="pad-container unit">
                <label htmlFor="unit-pad-input">Cube Padding:</label>
                <input 
                    id="unit-pad-input" 
                    type="range" 
                    name="unit" 
                    min="0.1" 
                    max="0.9" 
                    step="0.01" 
                    defaultValue={unitPadPerc}
                    onChange={e => handleSlider(e)}></input>
            </div>
            <div className="pad-container layer">
                <label htmlFor="layer-pad-input">Layer Padding:</label>
                <input 
                    id="layer-pad-input" 
                    type="range" 
                    name="layer" 
                    min="0" 
                    max="5" 
                    step="0.1" 
                    defaultValue={layerPadPerc}
                    onChange={e => handleSlider(e)}></input>
            </div>
        </a.div>
    ) : null;
}

const mapStateToProps = state => ({
    unitPadPerc: state.stack.unitPadPerc,
    layerPadPerc: state.stack.layerPadPerc
});

export default connect(mapStateToProps, { updateUnitPadding, updateLayerPadding })(ControlsModal);