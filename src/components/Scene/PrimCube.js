/* Dependencies */
import React, { useRef, useMemo, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import delay from 'delay';
import * as THREE from 'three';

import { setHover } from '../../redux/actions/viewActions';
import { prepForDeletion } from '../../redux/actions/viewActions';

const PrimCube = props => {
    const {position, size, opacity, path, element, parentSidelined} = props;
    const {deletionActive, hoverActive, setHover, prepForDeletion, activeFieldElements, topFieldLayer} = props;

    /* RESPOND TO REDUX CHANGES */
    const [activityState, setActivityState] = useState('collapsed');

    const inActiveField = useMemo(() => activeFieldElements.some(el => el.join(',') === path.join(',')), [activeFieldElements]);
    const inTopField = useMemo(() => topFieldLayer.some(el => el.join(',') === path.join(',')), [topFieldLayer]);

    useEffect(() => {
        inTopField ?
            setActivityState('focussed') :
        (inActiveField && !inTopField) || parentSidelined ?
            setActivityState('overriden') :
            setActivityState('collapsed');
    }, [inActiveField, inTopField, parentSidelined]);


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
    }, [element])

    useEffect(() => {
        setCubePosition(position);
        setCubeSize(size);
    }, [position, size]);


    /* RESPOND TO MOUSE EVENTS */
    const primClickHandler = e => {
        if(deletionActive && inTopField) {
            e.stopPropagation();
            prepForDeletion(element, path);
        } else if(deletionActive) {
            e.stopPropagation();
        }
    }

    const hoverHandler = (e, entering) => {
        if(activityState === 'focussed') {
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
        cOpacity: activityState === 'overriden' ? 0.2 : opacity
    });

    return (
        <a.mesh position={aProps.cPosition} scale={aProps.cSize} onPointerMove={e => hoverHandler(e, true)} onPointerOut={e => hoverHandler(e, false)} onClick={e => primClickHandler(e)}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]}/>
            <a.meshPhongMaterial attach="material" transparent color={cubeColor} opacity={aProps.cOpacity}/>
        </a.mesh>
    )
}

const mapStateToProps = state => ({
    hoverActive: state.view.hoverActive,
    deletionActive: state.view.deletionActive,

    activeFieldElements: state.stack.activeFieldElements,
    topFieldLayer: state.stack.topFieldLayer
});

PrimCube.propTypes = {
    hoverActive: PropTypes.bool,
    deletionActive: PropTypes.bool,

    activeFieldElements: PropTypes.array,
    topFieldLayer: PropTypes.array
};

export default connect(mapStateToProps, { prepForDeletion, setHover })(PrimCube);