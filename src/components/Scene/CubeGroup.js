// Dependencies
import React, { Suspense, useRef, useState, useEffect, useMemo} from 'react';
import { connect } from 'react-redux';
import delay from 'delay';
import PropTypes from 'prop-types';

// Three Dependencies
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import * as THREE from 'three';

// Imported Sheets
import { getCubeData, getFieldData, compensateFieldPositions } from '../../utils/Calculator';
import { usePrevious } from '../../utils/CustomHooks';
import ArrayCube from './ArrayCube';
import PrimCube from './PrimCube';
import { expandStack, collapseStack } from '../../redux/actions/stackActions';
import { persistTransition, completeTransition } from '../../redux/actions/viewActions';

const CubeGroup = props => {
    // Parent Props
    const { groupArray, path, depth, currentFieldPaths, position, size, opacity, parentSelected, parentFieldDim, parentFieldOffset, parentFocus } = props;
    // Redux Props
    const { prevTransitionActive, transitionActive, masterBasePosition, baseFieldSize, unitPadPerc, layerPadPerc, activeFieldElements, topFieldLayer, activeRoots, topRoot, expandStack, collapseStack, persistTransition, completeTransition } = props;

    const inActiveField = activeFieldElements.includes(path);
    const inTopField = topFieldLayer.includes(path);

    // Position Config
    const newFieldDim = Math.ceil(Math.sqrt(groupArray.length)) > parentFieldDim ? Math.ceil(Math.sqrt(groupArray.length)) : parentFieldDim;

    let { defaultPositions, raisedPositions, cubeElementSize } = getCubeData(groupArray, position, size, unitPadPerc);
    let { rawFieldPositions, fieldElementSize } = getFieldData(newFieldDim, masterBasePosition, baseFieldSize, unitPadPerc);
    let { trueFieldPositions, newFieldOffset } = compensateFieldPositions(rawFieldPositions, position, size, fieldElementSize, parentFieldOffset, layerPadPerc);

    // Internal State
    const nextFieldPaths = groupArray.map((e, i) => path+i);
    const nextFocus = parentFocus+(size[1]/2)+(fieldElementSize[1]/2)+layerPadPerc;
    const [selected, setSelected] = useState(false);
    const [suspended, setSuspended] = useState(false);

    const prevPosition = usePrevious(position);
    const [groupPosition, setGroupPosition] = useState(position);
    const [childPositions, setChildPositions] = useState(defaultPositions);

    const prevSize = usePrevious(size);
    const [childSize, setChildSize] = useState(cubeElementSize);
    const [childOpacity, setChildOpacity] = useState(1);
    
    /* RESPOND TO REDUX CHANGES*/
    useEffect(() => {
        // Transition out the current user or demo array
        async function staggerTransitionOut() {
            if(!prevTransitionActive && transitionActive) {
                setSelected(false);
                setChildPositions(raisedPositions);
                setChildOpacity(0);
                await delay(500);
                setSuspended(true);
                if (depth===0) persistTransition();
            }
        }
        staggerTransitionOut();
    }, [transitionActive]);

    /* RESPOND TO PARENT COMPONENT CHANGES */
    useEffect(() => {
        if(JSON.stringify(position) !== JSON.stringify(prevPosition)
           || JSON.stringify(size) !== JSON.stringify(prevSize)) {
            setGroupPosition(position);
            setChildPositions(defaultPositions);
            setChildSize(cubeElementSize);
        }
    }, [position, size]);
    
    useEffect(() => {
        // Transition in the new user or demo array
        if(prevTransitionActive && !transitionActive) {
            if (depth===0) completeTransition();
            async function staggerTransitionIn () {
                setGroupPosition(position);
                depth===0 ? setChildPositions(raisedPositions) :
                            setChildPositions(defaultPositions);
                setChildSize(cubeElementSize);
                await delay(300);
                setSuspended(false);
                if (depth===0) setChildPositions(defaultPositions);
                setChildOpacity(1);
            }
            staggerTransitionIn();
        };

        // Update the positions when a new element is added
        if(!prevTransitionActive && !transitionActive) {
            if(selected) {
                setChildPositions(trueFieldPositions);
                setChildSize(fieldElementSize);
            } else {
                setChildPositions(defaultPositions);
                setChildSize(cubeElementSize);
            }
        }
    }, [groupArray])

    useEffect(() => {
        if (!parentSelected) setSelected(false);
    }, [parentSelected]);

    const aProps = useSpring({
        gPosition: groupPosition,
        pointInt: parentSelected ? 0.5 : 0
    });

    /* RESPOND TO CHILD COMPONENT CHANGES */
    const selectionHandler = () => {
        if(inActiveField) {
            if (selected) {
                collapseStack(path, currentFieldPaths, activeFieldElements, activeRoots, parentFocus);
                changePositions(false);
            } else if(inTopField) {
                expandStack(path, nextFieldPaths, nextFocus);
                changePositions(true);
            };
        };
    };

    const changePositions = async (upwards) => {
        if(upwards) {
            setChildPositions(raisedPositions);
            await delay (500);
            setChildPositions(trueFieldPositions);
            setChildSize(fieldElementSize);
            setSelected(true);
        } else {
            setSelected(false);
            setChildPositions(raisedPositions);
            setChildSize(cubeElementSize);
            await delay(500);
            setChildPositions(defaultPositions);
        }
    }

    return (
        <a.mesh position={aProps.gPosition}>

            <a.pointLight 
              position={aProps.gPosition} 
              color="white"
              intensity={aProps.pointInt}
              distance={size[0]*2}/>
            <ArrayCube position={position} size={size} opacity={opacity} path={path} depth={depth} selectionHandler={selectionHandler} selected={selected}/>

            {suspended ? null : groupArray.map((lowerElement, i) => {
                return !childPositions[i] ? null : Array.isArray(lowerElement) ? (
                    <ConnectedCubeGroup 
                        groupArray={lowerElement}
                        path={nextFieldPaths[i]}
                        depth={depth+1}
                        currentFieldPaths={nextFieldPaths}

                        position={childPositions[i].map(vec => vec/2)}
                        size={childSize}
                        opacity={childOpacity}
                        parentSelected={selected}
                        parentFieldDim={newFieldDim}
                        parentFieldOffset={newFieldOffset}
                        parentFocus={nextFocus}
                        key={nextFieldPaths[i]}/>
                ) : (
                    <PrimCube
                        path={nextFieldPaths[i]} 
                        position={childPositions[i]}
                        size={childSize}
                        opacity={childOpacity}
                        key={nextFieldPaths[i]}/>
                )
            })}
        </a.mesh>
    )
}

const mapStateToProps = state => ({
    prevTransitionActive: state.view.prevTransitionActive,
    transitionActive: state.view.transitionActive,

    masterBasePosition: state.stack.masterBasePosition,
    baseFieldSize: state.stack.baseFieldSize,
    unitPadPerc: state.stack.unitPadPerc,
    layerPadPerc: state.stack.layerPadPerc,

    activeFieldElements: state.stack.activeFieldElements,
    topFieldLayer: state.stack.topFieldLayer,
    activeRoots: state.stack.activeRoots,
    topRoot: state.stack.topRoot
});

CubeGroup.propTypes = {
    prevTransitionActive: PropTypes.bool,
    transitionActive: PropTypes.bool,

    masterBasePosition: PropTypes.array,
    baseFieldSize: PropTypes.number,
    unitPadPerc: PropTypes.number,
    layerPadPerc: PropTypes.number,

    activeFieldElements: PropTypes.array,
    topFieldLayer: PropTypes.array,
    activeRoots: PropTypes.array,
    topRoot: PropTypes.string
};

const ConnectedCubeGroup = connect(mapStateToProps, {expandStack, collapseStack, persistTransition, completeTransition})(CubeGroup);

export default ConnectedCubeGroup;