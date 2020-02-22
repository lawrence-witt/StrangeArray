// Dependencies
import React, { useRef, useMemo, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import delay from 'delay';
import * as THREE from 'three';

const ArrayCube = props => {
    let { position, size, path, selectionHandler, selected } = props;
    let { expandedLayers, topLayer } = props;

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

    // Pass action to Parent
    const toggleExpansion = e => {
        e.stopPropagation();
        selectionHandler();
    }

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
    });

    return (
        <a.mesh position={aProps.cPosition} scale={aProps.cSize} onClick={e => toggleExpansion(e)}>
            <mesh>
                <geometry attach="geometry" vertices={vertices} faces={appliedFloorF} onUpdate={self => self.computeFaceNormals()}/>
                <meshPhongMaterial attach="material" color="grey" side={THREE.FrontSide} />
            </mesh>
            <mesh>
                <geometry attach="geometry" vertices={vertices} faces={appliedWallF} onUpdate={self => self.computeFaceNormals()}/>
                <meshPhongMaterial attach="material" color="grey" side={THREE.BackSide} />
            </mesh>
            <mesh>
                <geometry attach="geometry" vertices={vertices} faces={appliedFloorF} onUpdate={self => self.computeFaceNormals()}/>
                <meshPhongMaterial attach="material" color="grey" side={THREE.BackSide} />
            </mesh>
        </a.mesh>
    )
}

const mapStateToProps = state => ({
    masterBasePosition: state.array.masterBasePosition,
    baseFieldSize: state.array.baseFieldSize,
    unitPadPerc: state.array.unitPadPerc,
    layerPadPerc: state.array.layerPadPerc,

    expandedLayers: state.stack.expandedLayers,
    topLayer: state.stack.topLayer
});

export default connect(mapStateToProps)(ArrayCube);