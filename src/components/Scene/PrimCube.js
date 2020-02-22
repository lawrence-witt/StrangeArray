/* Dependencies */
import React, { useRef, useMemo, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import delay from 'delay';
import * as THREE from 'three';

const PrimCube = props => {
    const {position, size} = props;

    // Respond to Parent Changes
    const [cubePosition, setCubePosition] = useState(position);
    const [cubeSize, setCubeSize] = useState(size);

    useEffect(() => {
        setCubePosition(position);
        setCubeSize(size);
    }, [position, size]); 

    const aProps = useSpring({
        cPosition: cubePosition,
        cSize: cubeSize
    });

    return (
        <a.mesh position={aProps.cPosition} scale={aProps.cSize}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]}/>
            <meshPhongMaterial attach="material" transparent color="hotpink" opacity={1}/>
        </a.mesh>
    )
}

const mapStateToProps = state => ({
    masterBasePosition: state.array.masterBasePosition,
    baseFieldSize: state.array.baseFieldSize,
    unitPadPerc: state.array.unitPadPerc,
    layerPadPerc: state.array.layerPadPerc
});

export default connect(mapStateToProps)(PrimCube);