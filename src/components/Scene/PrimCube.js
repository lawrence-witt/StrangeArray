/* Dependencies */
import React, { useRef, useMemo, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import delay from 'delay';
import * as THREE from 'three';

import { usePrevious } from '../../utils/CustomHooks';
import { setHover, prepForDeletion, focusElement, unfocusElements } from '../../redux/actions/viewActions';
import IndexMarker from './IndexMarker';

const PrimCube = props => {
    // Parent props
    const {element, index, position, size, opacity, path, groupSelected, parentOverridden, font} = props;
    // Redux Props
    const {view, deletionActive, pendingDeletion, hoverActive, focusActive, focussedElement, activeFieldElements, topFieldLayer} = props;
    // Redux Actions
    const {setHover, focusElement, unfocusElements, prepForDeletion} = props;

    /* RESPOND TO REDUX CHANGES */
    const [displayState, setDisplayState] = useState('collapsed');
    const [highlighted, setHighlighted] = useState(false);

    const inActiveField = useMemo(() => activeFieldElements.some(el => el.join(',') === path.join(',')), [activeFieldElements]);
    const inTopField = useMemo(() => topFieldLayer.some(el => el.join(',') === path.join(',')), [topFieldLayer]);

    // Set display state
    useEffect(() => {
        inTopField ?
            setDisplayState('topLayer') :
        (inActiveField && !inTopField) || parentOverridden ?
            setDisplayState('overriden') :
            setDisplayState('collapsed');
    }, [inActiveField, inTopField, parentOverridden]);

    // Unhighlight self when another cube is selected/unselected for focus
    useEffect(() => {
        if(!focusActive ||
            path.join(',') !== focussedElement.path.join(',')) {
            setHighlighted(false);
        }
    }, [focusActive, focussedElement])

    // Unhighlight self when another cube is selected/unselected for deletion
    useEffect(() => {
        if(!deletionActive || 
           !pendingDeletion || 
           path.join(',') !== pendingDeletion.path.join(',')) {
            setHighlighted(false);
        }
    }, [deletionActive, pendingDeletion]);

    // Alter the cube position based on changes to highlight state
    useEffect(() => {
        highlighted ? setCubePosition([position[0], position[1]*1.2, position[2]]) : setCubePosition(position);
    }, [highlighted]);


    /* RESPOND TO PARENT CHANGES */
    const [cubePosition, setCubePosition] = useState(position);
    const [cubeSize, setCubeSize] = useState(size);
    const cubeColor = useMemo(() => {
        switch(element.type) {
            case 'Object':
                return new THREE.Color('blue');
            case 'String':
                return new THREE.Color('green');
            case 'Boolean':
                return new THREE.Color('crimson');
            case 'Number':
                return new THREE.Color('salmon');
            case 'BigInt':
                return new THREE.Color('sandybrown');
            case 'Null':
                return new THREE.Color('darkgray');
            case 'Undefined':
                return new THREE.Color('dimgray');
        }
    }, [element]);

    useEffect(() => {
        setCubePosition(position);
        setCubeSize(size);
    }, [position, size]);


    /* RESPOND TO MOUSE EVENTS */
    const primClickHandler = e => {
        if(deletionActive) {

            e.stopPropagation();
            if(inTopField && !highlighted) {
                setHighlighted(true);
                prepForDeletion(element, path);
            } else if(inTopField && highlighted) {
                setHighlighted(false);
                prepForDeletion(null, null, true);
            }

        } else if(!highlighted && inTopField) {

            e.stopPropagation();
            setHighlighted(true);
            focusElement(element, path);

        } else if(highlighted) {

            e.stopPropagation();
            setHighlighted(false);
            unfocusElements();

        }
    }

    const hoverHandler = (e, entering) => {
        if(displayState === 'topLayer') {
            e.stopPropagation();
            if(entering && !hoverActive) {
                setHover(true);
            } else if (!entering) {
                setHover(false);
            }
        }
    }

    // Animate Changes
    const aProps = useSpring({
        cPosition: cubePosition,
        cSize: cubeSize,
        cOpacity: displayState === 'overriden' ? 0.2 : opacity
    });

    return (
        <a.mesh 
          position={aProps.cPosition} 
          scale={aProps.cSize} 
          onPointerMove={e => hoverHandler(e, true)} 
          onPointerOut={e => hoverHandler(e, false)} 
          onClick={e => primClickHandler(e)}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]}/>
            <a.meshPhongMaterial attach="material" transparent color={cubeColor} opacity={aProps.cOpacity}/>
            
            {displayState === 'topLayer' && groupSelected && view !== 'home' ? (
                <IndexMarker font={font} index={index} cubeSize={cubeSize}/>
            ) : null}

        </a.mesh>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    hoverActive: state.view.hoverActive,
    focusActive: state.view.focusActive,
    focussedElement: state.view.focussedElement,
    deletionActive: state.view.deletionActive,
    pendingDeletion: state.view.pendingDeletion,

    activeFieldElements: state.stack.activeFieldElements,
    topFieldLayer: state.stack.topFieldLayer
});

PrimCube.propTypes = {
    view: PropTypes.string,
    hoverActive: PropTypes.bool,
    focussedElement: PropTypes.object,
    deletionActive: PropTypes.bool,

    activeFieldElements: PropTypes.array,
    topFieldLayer: PropTypes.array
};

export default connect(mapStateToProps, { prepForDeletion, setHover, focusElement, unfocusElements })(PrimCube);