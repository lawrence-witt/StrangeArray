import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './ControlsModal.css';
import { updateUnitPadding, updateLayerPadding } from '../../../redux/actions/stackActions';
import { useModal } from '../../../utils/CustomHooks';

const ControlsModal = props => {
    const { opened } = props;
    const { unitPadPerc, layerPadPerc, updateUnitPadding, updateLayerPadding } = props;

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, modalSpring] = useModal(opened, [], [], {});

    /* SLIDERS */
    const handleSlider = e => {
        e.stopPropagation();
        const slideName = e.target.name;
        const newSlideValue = Number(e.target.value);

        slideName === 'unitPad' ?
            updateUnitPadding(newSlideValue) :
            updateLayerPadding(newSlideValue);
    }

    return modalActive ? (
        <a.div className="editor-modal controls-modal" style={modalSpring}>
            <div className="pad-container unit">
                <label htmlFor="unit-pad-input">Cube Padding:</label>
                <input 
                    id="unit-pad-input" 
                    type="range" 
                    name="unitPad" 
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
                    name="layerPad" 
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