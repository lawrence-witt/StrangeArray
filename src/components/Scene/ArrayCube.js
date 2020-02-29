// Dependencies
import React, { useRef, useMemo, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import delay from 'delay';
import * as THREE from 'three';

// Imported Sheets
import { usePrevious } from '../../utils/CustomHooks';
import { deleteFromArray } from '../../redux/actions/arrayActions';

const ArrayCube = props => {
    let { position, size, opacity, path, depth, selectionHandler, groupSelected, parentSidelined } = props;
    let { dimensions, activeFieldElements, topFieldLayer, deleteFromArray, deletionActive} = props;

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


    /* RESPOND TO REDUX CHANGES */
    const inActiveField = useMemo(() => activeFieldElements.some(el => el.join(',') === path.join(',')), [activeFieldElements]);
    const inTopField = useMemo(() => topFieldLayer.some(el => el.join(',') === path.join(',')), [topFieldLayer]);

    //const [cubeSelected, setCubeSelected] = useState(false);
    const [activityState, setActivityState] = useState('collapsed')
    const [relativeStrength, setRelativeStrength] = useState(0);

    useEffect(() => {
        inTopField ? 
            setActivityState('focussed') :
        inActiveField && groupSelected ?
            setActivityState('expanded') :
        parentSidelined ?
            setActivityState('overriden') :
            setActivityState('collapsed');
    }, [inActiveField, inTopField, groupSelected, parentSidelined]);

    useEffect(() => {
        const newStrength = 1 - (1/dimensions)*depth === 0 ? 10 :
                            Math.round((1 - (1/dimensions)*depth)*100);
        setRelativeStrength(newStrength);
    }, [dimensions]);


    /* RESPOND TO PARENT CHANGES */
    const [cubePosition, setCubePosition] = useState(position);
    const [cubeSize, setCubeSize] = useState(size);
    
    useEffect(() => {
        setCubePosition(position);
        setCubeSize(size);
    }, [position, size]); 

    /* RESPOND TO CLICK EVENT */
    const arrayClickHandler = e => {
        if(deletionActive && inTopField) {
            e.stopPropagation();
            deleteFromArray(path);
        } else if (deletionActive) {
            e.stopPropagation();
        } else if (inActiveField && !parentSidelined) {
            e.stopPropagation();
            selectionHandler();
        }
    }

    // Animate Changes
    const aProps = useSpring({
        cPosition: cubePosition,
        cSize: cubeSize,
        cOpacity: activityState === 'overriden' ? 0.2 : opacity
    });

    return (
        <a.instancedMesh position={aProps.cPosition} scale={aProps.cSize} onClick={e => arrayClickHandler(e)}>
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
        </a.instancedMesh>
    )
}

const mapStateToProps = state => ({
    deletionActive: state.view.deletionActive,

    dimensions: state.array.dimensions,

    masterBasePosition: state.stack.masterBasePosition,
    baseFieldSize: state.stack.baseFieldSize,
    unitPadPerc: state.stack.unitPadPerc,
    layerPadPerc: state.stack.layerPadPerc,

    activeFieldElements: state.stack.activeFieldElements,
    topFieldLayer: state.stack.topFieldLayer
});

export default connect(mapStateToProps, { deleteFromArray })(ArrayCube);