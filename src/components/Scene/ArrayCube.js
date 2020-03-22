// Dependencies
import React, { useMemo, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSpring, a } from 'react-spring/three';
import * as THREE from 'three';

// Imported Sheets
import IndexMarker from './IndexMarker';
import { setHover, prepForDeletion, prepForSwap, setEditorState, focusElement, unfocusElements } from '../../redux/actions/viewActions';

const ArrayCube = props => {
    // Parent Props
    let { element, position, size, opacity, path, stackHandler, setGroupPosition, parentSelected, inActiveRoots, inActiveField, inTopField, isOverridden, layerGapFactor, font, index } = props;
    // Redux Props
    let { view, hoverActive, pendingDeletion, pendingSwap, editorState } = props;
    // Redux Actions
    let { setHover, setEditorState, prepForDeletion, prepForSwap, unfocusElements } = props;


    /* RESPOND TO REDUX CHANGES */
    const [displayState, setdisplayState] = useState('collapsed');
    const [highlighted, setHighlighted] = useState(false);
    
    // Set display state
    useEffect(() => {
        inTopField ? 
            setdisplayState('topLayer') :
        inActiveRoots ?
            setdisplayState('expanded') :
        isOverridden ?
            setdisplayState('overridden') :
            setdisplayState('collapsed');
    }, [inActiveRoots, inTopField, isOverridden]);

    // Unhighlight self on new editor state
    useEffect(() => {
        setHighlighted(false);
    }, [editorState]);

    // Unhighlight self when removed from delete/swap
    useEffect(() => {
        const pathString = path.join(',');
        const pathChecks = [
            pendingDeletion.path.join(','),
            pendingSwap[0].path.join(','),
            pendingSwap[1].path.join(',')
        ];
        if(!pathChecks.some(check => pathString === check)) {
            setHighlighted(false);
        }
    }, [pendingDeletion, pendingSwap]);

    // Alter the parent group position based on changes to highlight state
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
        if(editorState.remove) {

            e.stopPropagation();
            if(inTopField && !highlighted) {
                setHighlighted(true);
                prepForDeletion({type: 'Array', content: `[${path.join('] [')}]`}, path);
            } else if(inTopField && highlighted) {
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
            setEditorState(null);
            stackHandler();
        }
    }

    const hoverHandler = (e, entering) => {
        if(displayState === 'topLayer' || displayState === 'expanded') {
            e.stopPropagation();
            if(displayState === 'topLayer') {
                if(entering && !hoverActive) {
                    setHover(true);
                } else if(!entering){
                    setHover(false);
                }
            } else if(displayState === 'expanded') {
                if(editorState.swap || editorState.remove) {
                    return;
                } else if(entering && !hoverActive) {
                    setHover(true);
                } else if(!entering){
                    setHover(false);
                }
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
                <IndexMarker layerGapFactor={layerGapFactor} inTopField={inTopField} font={font} index={index}/>
            ) : null}
        </a.mesh>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    editorState: state.view.editorState,
    hoverActive: state.view.hoverActive,
    pendingDeletion: state.view.pendingDeletion,
    pendingSwap: state.view.pendingSwap,

    layerPadPerc: state.stack.layerPadPerc
});

ArrayCube.propTypes = {
    view: PropTypes.string,
    editorState: PropTypes.object,
    hoverActive: PropTypes.bool,
    pendingDeletion: PropTypes.object,
    pendingSwap: PropTypes.object,
}

export default connect(mapStateToProps, { 
    setHover, prepForDeletion, prepForSwap, setEditorState, focusElement, unfocusElements 
})(ArrayCube);