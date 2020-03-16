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
import { setHover, prepForDeletion, prepForSwap, setEditorState, focusElement, unfocusElements } from '../../redux/actions/viewActions';

const ArrayCube = props => {
    // Parent Props
    let { element, position, size, opacity, path, depth, stackHandler, setGroupPosition, parentSelected, inActiveRoots, inActiveField, inTopField, isOverridden, font, index } = props;
    // Redux Props
    let { view, dimensions, hoverActive, pendingDeletion, pendingSwap, editorState } = props;
    // Redux Actions
    let { setHover, setEditorState, prepForDeletion, prepForSwap, unfocusElements } = props;


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
    useEffect(() => {
        if(!editorState.delete || 
           !pendingDeletion || 
           path.join(',') !== pendingDeletion.path.join(',')) {
            setHighlighted(false);
        }
    }, [editorState.delete, pendingDeletion]);

    // Unhighlight self when another cube is selected/unselected for swap
    useEffect(() => {
        if(!editorState.swap ||
            path.join(',') !== pendingSwap[0].path.join(',') &&
            path.join(',') !== pendingSwap[1].path.join(',')) {
                setHighlighted(false);
            }
    }, [editorState.swap, pendingSwap]);

    // Alter the cube position based on changes to highlight state
    useEffect(() => {
        highlighted ? 
            setGroupPosition([position[0], position[1]+size[1]/2, position[2]]) : 
            setGroupPosition(position);
    }, [highlighted])
    

    /* RESPOND TO PARENT CHANGES */
    const [cubePosition, setCubePosition] = useState(position);
    const [cubeSize, setCubeSize] = useState(size);
    
    useEffect(() => {
        setCubePosition(position);
        setCubeSize(size);
    }, [...position, ...size]);
    

    /* RESPOND TO MOUSE EVENTS */
    const arrayClickHandler = e => {
        if(editorState.controls) return;
        if(editorState.delete && inTopField) {

            e.stopPropagation();
            if(!highlighted) {
                setHighlighted(true);
                prepForDeletion({type: 'Array', content: path}, path);
            } else if(highlighted) {
                setHighlighted(false);
                prepForDeletion(null, null, false);
            }

        } else if(editorState.swap) {

            e.stopPropagation();
            if(inTopField && !highlighted) {
                setHighlighted(true);
                prepForSwap({type: 'Array', content: element}, path);
            } else if(inTopField && highlighted) {
                setHighlighted(false);
                prepForSwap({type: 'Array', content: element}, path, false);
            }

        } else if(editorState.delete) {

            e.stopPropagation();

        } else if(inActiveField && !isOverridden) {

            e.stopPropagation();
            unfocusElements();
            /* setEditorState(null); */
            stackHandler();
        }
    }

    const hoverHandler = (e, entering) => {
        if(displayState === 'focussed' || displayState === 'expanded') {
            e.stopPropagation();
            if(entering && !hoverActive && !editorState.controls) {
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

    const geom = useMemo(() => new THREE.BoxBufferGeometry(1, 1, 1), []);

    return (
        <a.mesh 
          position={aProps.cPosition} 
          scale={aProps.cSize}>
            <mesh
            onPointerMove={e => hoverHandler(e, true)} 
            onPointerOut={e => hoverHandler(e, false)} 
            onClick={e => arrayClickHandler(e)}>
                <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
                <meshPhongMaterial attach="material" transparent alphaTest={2}/>
            </mesh>
            <lineSegments >
                <edgesGeometry attach="geometry" args={[geom]} />
                <a.lineBasicMaterial color="white" transparent opacity={aProps.cOpacity} attach="material"/>
            </lineSegments>
            
            {displayState !== 'overridden' && parentSelected && view !== 'home' ? (
                <IndexMarker font={font} index={index} cubeSize={cubeSize}/>
            ) : null}
        </a.mesh>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    editorState: state.view.editorState,
    hoverActive: state.view.hoverActive,
    deletionActive: state.view.deletionActive,
    pendingDeletion: state.view.pendingDeletion,
    swapActive: state.view.swapActive,
    pendingSwap: state.view.pendingSwap,
    controlsActive: state.view.controlsActive,

    dimensions: state.stack.dimensions,

    masterBasePosition: state.stack.masterBasePosition,
    baseFieldSize: state.stack.baseFieldSize,
    unitPadPerc: state.stack.unitPadPerc,
    layerPadPerc: state.stack.layerPadPerc,

    activeFieldElements: state.stack.activeFieldElements,
    topFieldLayer: state.stack.topFieldLayer
});

export default connect(mapStateToProps, { setHover, prepForDeletion, prepForSwap, setEditorState, focusElement, unfocusElements })(ArrayCube);