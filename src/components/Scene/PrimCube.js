/* Dependencies */
import React, { useMemo, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSpring, a } from 'react-spring/three';
import * as THREE from 'three';

import { setHover, prepForDeletion, prepForSwap, focusElement, setEditorState } from '../../redux/actions/viewActions';
import IndexMarker from './IndexMarker';

const PrimCube = props => {
    // Parent props
    const {element, index, position, size, opacity, path, groupSelected, parentOverridden, inActiveField, inTopField, font, layerGapFactor} = props;
    // Redux Props
    const {view, editorState, pendingDeletion, hoverActive, focussedElement, pendingSwap} = props;
    // Redux Actions
    const {setHover, focusElement, setEditorState, prepForDeletion, prepForSwap} = props;


    /* RESPOND TO REDUX CHANGES */
    const [displayState, setDisplayState] = useState('collapsed');
    const [highlighted, setHighlighted] = useState(false);

    // Set display state
    useEffect(() => {
        inTopField ?
            setDisplayState('topLayer') :
        (inActiveField && !inTopField) || parentOverridden ?
            setDisplayState('overriden') :
            setDisplayState('collapsed');
    }, [inActiveField, inTopField, parentOverridden]);

    // Unhighlight self on new editor state
    useEffect(() => {
        if(editorState.focus) {
            return;
        } else {
            setHighlighted(false);
        }
    }, [editorState]);

    // Unhighlight self when removed from focus/delete/swap
    useEffect(() => {
        const pathString = path.join(',');
        const pathChecks = [
            focussedElement.path.join(','),
            pendingDeletion.path.join(','),
            pendingSwap[0].path.join(','),
            pendingSwap[1].path.join(',')
        ];
        if(!pathChecks.some(check => pathString === check)) {
            setHighlighted(false);
        }
    }, [focussedElement, pendingDeletion, pendingSwap]);

    // Alter the cube position based on changes to highlight state
    useEffect(() => {
        highlighted ? 
            setCubePosition([position[0], position[1]+size[1]/2, position[2]]) : 
            setCubePosition(position);
    }, [highlighted]);


    /* RESPOND TO PARENT CHANGES */
    // Initialise cube in highlighted position if it has been swapped in
    const [cubePosition, setCubePosition] = useState(() => {
            return editorState.swap || editorState.remove ? [position[0], position[1]+size[1]/2, position[2]] : position;
    });
    const [cubeSize, setCubeSize] = useState(size);
    const cubeColor = useMemo(() => {
        switch(element.type) {
            case 'Object':
                return new THREE.Color('cornflowerblue');
            case 'String':
                return new THREE.Color('seagreen');
            case 'Boolean':
                return new THREE.Color('crimson');
            case 'Number':
                return new THREE.Color('salmon');
            case 'Null':
                return new THREE.Color('dimgray');
        }
    }, [element]);

    useEffect(() => {
        setCubePosition(position);
        setCubeSize(size);
    }, [...position, ...size]);


    /* RESPOND TO MOUSE EVENTS */
    const primClickHandler = e => {
        if(editorState.remove) {

            if(inTopField && !highlighted) {
                e.stopPropagation();
                setHighlighted(true);
                prepForDeletion(element, path);
            } else if(inTopField && highlighted) {
                e.stopPropagation();
                setHighlighted(false);
                prepForDeletion(null, null, false);
            } else if(displayState === 'overridden') {
                e.stopPropagation();
            }

        } else if(editorState.swap){

            if(inTopField && !highlighted) {
                e.stopPropagation();
                setHighlighted(true);
                prepForSwap(element, path);
            } else if(inTopField && highlighted) {
                e.stopPropagation();
                setHighlighted(false);
                prepForSwap(element, path, false);
            }

        } else if(!highlighted && inTopField) {

            e.stopPropagation();
            setHighlighted(true);
            focusElement(element, path);

        } else if(highlighted) {

            e.stopPropagation();
            setHighlighted(false);
            setEditorState(null);
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
                <IndexMarker layerGapFactor={layerGapFactor} inTopField={inTopField} font={font} index={index}/>
            ) : null}

        </a.mesh>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    editorState: state.view.editorState,
    hoverActive: state.view.hoverActive,
    focussedElement: state.view.focussedElement,
    pendingDeletion: state.view.pendingDeletion,
    pendingSwap: state.view.pendingSwap
});

PrimCube.propTypes = {
    view: PropTypes.string,
    editorState: PropTypes.object,
    hoverActive: PropTypes.bool,
    focussedElement: PropTypes.object,
    pendingDeletion: PropTypes.object,
    pendingSwap: PropTypes.object,
};

export default connect(mapStateToProps, { 
    prepForDeletion, setHover, focusElement, prepForSwap, setEditorState 
})(PrimCube);