/* Dependencies */
import React, { useRef, useMemo, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import delay from 'delay';
import * as THREE from 'three';

const PrimCube = props => {
    const {position, size, opacity, path} = props;
    const {activeFieldElements, topFieldLayer} = props;

    const [activityState, setActivityState] = useState('collapsed')

    // Respond to Redux Changes
    useEffect(() => {
        topFieldLayer.includes(path) ?
            setActivityState('focussed') :
        activeFieldElements.includes(path) ?
            setActivityState('overriden') :
            setActivityState('collapsed');
    }, [activeFieldElements, topFieldLayer]);

    // Respond to Parent Changes
    const [cubePosition, setCubePosition] = useState(position);
    const [cubeSize, setCubeSize] = useState(size);

    useEffect(() => {
        setCubePosition(position);
        setCubeSize(size);
    }, [position, size]); 

    // Animate Changes
    const aProps = useSpring({
        cPosition: cubePosition,
        cSize: cubeSize,
        cOpacity: activityState === 'overriden' ? 0.3 : opacity
    });

    return (
        <a.mesh position={aProps.cPosition} scale={aProps.cSize}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]}/>
            <a.meshPhongMaterial attach="material" transparent color="hotpink" opacity={aProps.cOpacity}/>
        </a.mesh>
    )
}

const mapStateToProps = state => ({
    activeFieldElements: state.stack.activeFieldElements,
    topFieldLayer: state.stack.topFieldLayer
});

PrimCube.propTypes = {
    activeFieldElements: PropTypes.array,
    topFieldLayer: PropTypes.array
};

export default connect(mapStateToProps)(PrimCube);