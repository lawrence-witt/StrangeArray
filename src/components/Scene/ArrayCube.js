// Dependencies
import React, { useRef, useMemo, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import delay from 'delay';
import * as THREE from 'three';

// Imported Sheets
import { usePrevious } from '../../utils/CustomHooks';
import IndexMarker from './IndexMarker';
import { setHover, prepForDeletion, unfocusElements } from '../../redux/actions/viewActions';

const ArrayCube = props => {
    // Parent Props
    let { position, size, opacity, path, depth, selectionHandler, parentSelected, inActiveRoots, inActiveField, inTopField, isOverridden, font, index } = props;
    // Redux Props
    let { view, dimensions, prepForDeletion, hoverActive, setHover, unfocusElements, deletionActive, pendingDeletion} = props;

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
    const [displayState, setdisplayState] = useState('collapsed');
    const [highlighted, setHighlighted] = useState(false);
    const [relativeStrength, setRelativeStrength] = useState(0);

    useEffect(() => {
        inTopField ? 
            setdisplayState('focussed') :
        inActiveRoots ?
            setdisplayState('expanded') :
        isOverridden ?
            setdisplayState('overridden') :
            setdisplayState('collapsed');
    }, [inActiveRoots, inTopField, isOverridden]);

    useEffect(() => {
        const newStrength = 1 - (1/dimensions)*depth === 0 ? 10 :
                            Math.round((1 - (1/dimensions)*depth)*100);
        setRelativeStrength(newStrength);
    }, [dimensions]);

    // Unhighlight self when another cube is selected/unselected for deletion
    // This is broken, does not work the same way as primCube for some reason
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
    
    useEffect(() => {
        setCubePosition(position);
        setCubeSize(size);
    }, [position, size]);
    

    /* RESPOND TO MOUSE EVENTS */
    const arrayClickHandler = e => {
        if(deletionActive && inTopField) {

            e.stopPropagation();
            if(inTopField && !highlighted) {
                setHighlighted(true);
                prepForDeletion({type: 'Array', content: path}, path);
            } else if(inTopField && highlighted) {
                setHighlighted(false);
                prepForDeletion(null, null, true);
            }

        } else if (deletionActive) {

            e.stopPropagation();

        } else if (inActiveField && !isOverridden) {

            e.stopPropagation();
            unfocusElements();
            selectionHandler();
        }
    }

    const hoverHandler = (e, entering) => {
        if(displayState === 'focussed' || displayState === 'expanded') {
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
        cOpacity: displayState === 'overridden' ? 0.2 : opacity
    });

    return (
        <a.mesh 
          position={aProps.cPosition} 
          scale={aProps.cSize} 
          onPointerMove={e => hoverHandler(e, true)} 
          onPointerOut={e => hoverHandler(e, false)} 
          onClick={e => arrayClickHandler(e)}>
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
            {displayState !== 'overridden' && depth !== 0 && parentSelected && view !== 'home' ? (
                <IndexMarker font={font} index={index} cubeSize={cubeSize}/>
            ) : null}
        </a.mesh>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    hoverActive: state.view.hoverActive,
    deletionActive: state.view.deletionActive,
    pendingDeletion: state.view.pendingDeletion,

    dimensions: state.stack.dimensions,

    masterBasePosition: state.stack.masterBasePosition,
    baseFieldSize: state.stack.baseFieldSize,
    unitPadPerc: state.stack.unitPadPerc,
    layerPadPerc: state.stack.layerPadPerc,

    activeFieldElements: state.stack.activeFieldElements,
    topFieldLayer: state.stack.topFieldLayer
});

export default connect(mapStateToProps, { setHover, prepForDeletion, unfocusElements })(ArrayCube);