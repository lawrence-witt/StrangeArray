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
    const { groupArray, path, depth, currentFieldPaths, position, size, opacity, parentSelected, parentLightActive, parentSidelined, parentFieldDim, parentFieldOffset, parentFocus } = props;
    // Redux Props
    const { prevTransitionActive, transitionActive, masterBasePosition, baseFieldSize, unitPadPerc, layerPadPerc, activeFieldElements, topFieldLayer, activeRoots, expandStack, collapseStack, persistTransition, completeTransition } = props;

    // Position Config
    const newFieldDim = Math.ceil(Math.sqrt(groupArray.length)) > parentFieldDim ? Math.ceil(Math.sqrt(groupArray.length)) : parentFieldDim;

    const { defaultPositions, raisedPositions, cubeElementSize } = getCubeData(groupArray, position, size, unitPadPerc);
    const { rawFieldPositions, fieldElementSize } = getFieldData(newFieldDim, masterBasePosition, baseFieldSize, unitPadPerc);
    const { trueFieldPositions, newFieldOffset } = compensateFieldPositions(rawFieldPositions, position, size, fieldElementSize, parentFieldOffset, layerPadPerc);

    // Internal State
    const inActiveField = useMemo(() => activeFieldElements.some(el => el.join(',') === path.join(',')), [activeFieldElements]);
    const inTopField = useMemo(() => topFieldLayer.some(el => el.join(',') === path.join(',')), [topFieldLayer]);
    const inActiveRoots = useMemo(() => activeRoots.some(el => el.join(',') === path.join(',')), [activeRoots]);
    const inSidelinedPath = parentSidelined || (inActiveField && !inTopField && !inActiveRoots);

    const [pointLightActive, setPointLightActive] = useState(false);

    const nextFieldPaths = groupArray.map((e, i) => [...path, i]);
    const nextFocus = parentFocus+(size[1]/2)+(fieldElementSize[1]/2)+layerPadPerc;
    const [groupSelected, setGroupSelected] = useState(false);
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
        if(!prevTransitionActive && transitionActive) {
            async function staggerTransitionOut() {
                setGroupSelected(false);
                setPointLightActive(false);
                setChildPositions(raisedPositions);
                setChildOpacity(0);
                await delay(500);
                setSuspended(true);
                if (depth===0) persistTransition();
            }
            staggerTransitionOut();
        }
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
            async function staggerTransitionIn () {
                setGroupPosition(position);
                depth===0 ? setChildPositions(raisedPositions) :
                            setChildPositions(defaultPositions);
                setChildSize(cubeElementSize);
                await delay(300);
                setSuspended(false);
                setChildOpacity(1);
                if (depth===0) {
                    setChildPositions(defaultPositions);
                    completeTransition();
                }
            }
            staggerTransitionIn();
        };

        // Update the positions when a new element is added or removed
        if(!prevTransitionActive && !transitionActive) {
            if(groupSelected) {
                setChildPositions(trueFieldPositions);
                setChildSize(fieldElementSize);
            } else {
                setChildPositions(defaultPositions);
                setChildSize(cubeElementSize);
            }
        }
    }, [groupArray])

    useEffect(() => {
        if (!parentSelected) setGroupSelected(false); setPointLightActive(false);
    }, [parentSelected]);

    // Animate Changes
    const aProps = useSpring({
        gPosition: groupPosition,
        pointInt: parentLightActive ? 0.5 : 0
    });


    /* RESPOND TO CHILD COMPONENT CHANGES */
    const selectionHandler = () => {
        if(inActiveField) {
            if (groupSelected) {
                collapseStack(path, currentFieldPaths, parentFocus);
                changePositions(false);
            } else if(inTopField) {
                expandStack(path, nextFieldPaths, nextFocus);
                changePositions(true);
            };
        };
    };

    const changePositions = async (upwards) => {
        if(upwards) {
            setGroupSelected(true);
            setChildPositions(raisedPositions);
            await delay (500);
            setChildPositions(trueFieldPositions);
            setChildSize(fieldElementSize);
            setPointLightActive(true);
        } else {
            setPointLightActive(false);
            setGroupSelected(false);
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
            <ArrayCube 
                position={position} 
                size={size} 
                opacity={opacity} 
                path={path} 
                depth={depth} 
                selectionHandler={selectionHandler}
                parentSidelined={inSidelinedPath}
                groupSelected={groupSelected}/>

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
                        parentSelected={groupSelected}
                        parentLightActive={pointLightActive}
                        parentSidelined={inSidelinedPath}
                        parentFieldDim={newFieldDim}
                        parentFieldOffset={newFieldOffset}
                        parentFocus={nextFocus}
                        key={nextFieldPaths[i].join(',')}/>
                ) : (
                    <PrimCube
                        element={lowerElement}
                        path={nextFieldPaths[i]}
                        parentSidelined={inSidelinedPath}
                        
                        position={childPositions[i]}
                        size={childSize}
                        opacity={childOpacity}
                        key={nextFieldPaths[i].join(',')}/>
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
    topRoot: PropTypes.array
};

const ConnectedCubeGroup = connect(mapStateToProps, {
    expandStack, collapseStack, persistTransition, completeTransition
})(CubeGroup);

export default ConnectedCubeGroup;