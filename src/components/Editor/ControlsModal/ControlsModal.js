import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './ControlsModal.css';
import { updateUnitPadding, updateLayerPadding } from '../../../redux/actions/stackActions';
import { usePrevious } from '../../../utils/CustomHooks';

const ControlsModal = props => {
    const { opened } = props;
    const { unitPadPerc, layerPadPerc, updateUnitPadding, updateLayerPadding } = props;

    // Set default values on mount
    const mountPadding = useMemo(() => {
        return {
            unit: unitPadPerc,
            layer: layerPadPerc
        }
    }, [])


    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, setModalActive] = useState(false);
    const [modalEntering, setModalEntering] = useState(false);
    const prevEntering = usePrevious(modalEntering);

    useEffect(() => {
        opened ? setModalEntering(true) : setModalEntering(false);
    }, [opened]);

    useEffect(() => {
        if(modalEntering) setModalActive(true);
    }, [modalEntering])

    const modalSpring = useSpring({
        transform: modalEntering ? 'translateY(0%)' : 'translateY(-100%)',
        onRest: () => {if(!modalEntering && prevEntering) {
            setModalActive(false);
        }}
    });


    /* SLIDERS */
    const handleSlider = e => {
        const slideName = e.target.name;
        const newSlideValue = Number(e.target.value);

        slideName === 'unitPad' ?
            updateUnitPadding(newSlideValue) :
            updateLayerPadding(newSlideValue);
    }

    return modalActive ? (
        <a.div className="controls-modal" style={modalSpring}>
            <div className="unit-pad-container">
                <label>Cube Padding</label>
                <input 
                    className="unit-pad-input" 
                    type="range" 
                    name="unitPad" 
                    min="0.1" 
                    max="0.9" 
                    step="0.01" 
                    defaultValue={unitPadPerc}
                    onChange={e => handleSlider(e)}></input>
            </div>
            <div className="layer-pad-container">
                <label>Layer Padding</label>
                <input 
                    className="layer-pad-input" 
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