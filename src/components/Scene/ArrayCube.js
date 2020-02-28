// Dependencies
import React, { useRef, useMemo, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import delay from 'delay';
import * as THREE from 'three';

// Imported Sheets
import { usePrevious } from '../../utils/CustomHooks';

const ArrayCube = props => {
    let { position, size, opacity, path, depth, selectionHandler, selected } = props;
    let { dimensions, activeFieldElements, topFieldLayer } = props;

    // Geometry Config
    const cubeVertices = [[-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5]];
    const wallFaces = [
        [4, 0, 2], [6, 4, 2], //Left
        [0, 4, 5], [1, 0, 5], //Back
        [3, 1, 5], [5, 7, 3], //Right
        [2, 3, 6], [3, 7, 6]  //Front
    ];
    const floorFaces = [[2, 0, 3], [0, 1, 3]];

    const vertices = useMemo(() => cubeVertices.map(v => new THREE.Vector3(...v)), []);
    const appliedWallF = useMemo(() => wallFaces.map(f => new THREE.Face3(...f)), []);
    const appliedFloorF = useMemo(() => floorFaces.map(f => new THREE.Face3(...f)), []);

    // Respond to Redux Changes
    const [activityState, setActivityState] = useState('collapsed')
    const [relativeStrength, setRelativeStrength] = useState(0);

    useEffect(() => {
        activeFieldElements.includes(path) ?
            setActivityState('expanded') :
            setActivityState('collapsed');
    }, [activeFieldElements, topFieldLayer]);

    useEffect(() => {
        const newStrength = 1 - (1/dimensions)*depth === 0 ? 10 :
                            Math.round((1 - (1/dimensions)*depth)*100);
        setRelativeStrength(newStrength);
    }, [dimensions]);

    // Respond to Parent Changes
    const [cubePosition, setCubePosition] = useState(position);
    const [cubeSize, setCubeSize] = useState(size);
    
    useEffect(() => {
        setCubePosition(position);
        setCubeSize(size);
    }, [position, size]); 

    // Pass action to Parent
    const toggleExpansion = e => {
        e.stopPropagation();
        selectionHandler();
    }

    // Animate Changes
    const aProps = useSpring({
        cPosition: cubePosition,
        cSize: cubeSize,
        cOpacity: opacity
    });

    return (
        <a.mesh position={aProps.cPosition} scale={aProps.cSize} onClick={e => toggleExpansion(e)}>
            <mesh>
                <geometry attach="geometry" vertices={vertices} faces={appliedFloorF} onUpdate={self => self.computeFaceNormals()}/>
                <a.meshPhongMaterial attach="material" color="grey" transparent opacity={aProps.cOpacity} side={THREE.FrontSide} />
            </mesh>
            <mesh>
                <geometry attach="geometry" vertices={vertices} faces={appliedWallF} onUpdate={self => self.computeFaceNormals()}/>
                <a.meshPhongMaterial attach="material" color="grey" transparent opacity={aProps.cOpacity} side={THREE.BackSide} />
            </mesh>
            <mesh>
                <geometry attach="geometry" vertices={vertices} faces={appliedFloorF} onUpdate={self => self.computeFaceNormals()}/>
                <a.meshPhongMaterial attach="material" color="grey" transparent opacity={aProps.cOpacity} side={THREE.BackSide} />
            </mesh>
        </a.mesh>
    )
}

const mapStateToProps = state => ({
    dimensions: state.array.dimensions,

    masterBasePosition: state.stack.masterBasePosition,
    baseFieldSize: state.stack.baseFieldSize,
    unitPadPerc: state.stack.unitPadPerc,
    layerPadPerc: state.stack.layerPadPerc,

    activeFieldElements: state.stack.activeFieldElements,
    topFieldLayer: state.stack.topFieldLayer
});

export default connect(mapStateToProps)(ArrayCube);