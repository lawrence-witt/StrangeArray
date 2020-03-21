// Dependencies
import React, { Suspense, useRef, useState, useEffect, useMemo} from 'react';
import { connect } from 'react-redux';
import delay from 'delay';
import PropTypes from 'prop-types';

// Three Dependencies
import { useSpring, a } from 'react-spring/three';

// Imported Sheets
import { getCubeData, getFieldData, compensateFieldPositions } from '../../utils/Calculator';
import ArrayCube from './ArrayCube';
import PrimCube from './PrimCube';
import { expandStack, collapseStack, refocusStack } from '../../redux/actions/stackActions';

const CubeGroup = props => {
    // Parent Props
    const { groupArray, index, path, currentFieldPaths, position, size, opacity, parentSelected, parentOverridden, parentFieldDim, parentFieldOffset, parentFocus, font } = props;
    // Redux Props
    const { transitionActive, masterBasePosition, baseFieldSize, unitPadPerc, layerPadPerc, activeFieldElements, topFieldLayer, activeRoots, topRoot, editorState } = props;
    // Redux Actions
    const { expandStack, collapseStack, refocusStack } = props;

    // Position/Size Config
    const newFieldDim = Math.ceil(Math.sqrt(groupArray.length)) > parentFieldDim ? Math.ceil(Math.sqrt(groupArray.length)) : parentFieldDim;

    const { defaultPositions, raisedPositions, cubeElementSize } = getCubeData(groupArray, position, size, unitPadPerc);
    const { rawFieldPositions, fieldElementSize } = getFieldData(newFieldDim, masterBasePosition, baseFieldSize, unitPadPerc);
    const { trueFieldPositions, newFieldOffset } = compensateFieldPositions(rawFieldPositions, position, size, fieldElementSize, parentFieldOffset, layerPadPerc);

    // Internal State
    const inActiveField = useMemo(() => activeFieldElements.some(el => el.join(',') === path.join(',')), [activeFieldElements]);
    const inTopField = useMemo(() => topFieldLayer.some(el => el.join(',') === path.join(',')), [topFieldLayer]);
    const inActiveRoots = useMemo(() => activeRoots.some(el => el.join(',') === path.join(',')), [activeRoots]);
    const isTopRoot = useMemo(() => topRoot.join(',') === path.join(','), [topRoot]);
    const isOverridden = parentOverridden || (inActiveField && !inTopField && !inActiveRoots);

    const nextFieldPaths = groupArray.map((e, i) => [...path, i.toString()]);
    const nextFocus = parentFocus+(size[1]/2)+(fieldElementSize[1]/2)+layerPadPerc;

    const [groupSelected, setGroupSelected] = useState(false);
    const [groupPosition, setGroupPosition] = useState(() => {
        return editorState.swap || editorState.remove ? [position[0], position[1]+size[1]/2, position[2]] : position;
    });
    const [childPositions, setChildPositions] = useState(defaultPositions);
    const [childSize, setChildSize] = useState(cubeElementSize);


    /* RESPOND TO PARENT COMPONENT CHANGES */
    // Persist new positions/size when config changes
    useEffect(() => {
        setGroupPosition(position);
        if(!editorState.controls){
            setChildPositions(defaultPositions);
            setChildSize(cubeElementSize);
        } else {
            if(isTopRoot) refocusStack(nextFocus);
            if(inActiveRoots) {
                setGroupPosition(position);
                setChildSize(fieldElementSize);
                setChildPositions(trueFieldPositions);
            } else {
                setGroupPosition(position);
                setChildSize(cubeElementSize);
                setChildPositions(defaultPositions);
            }
        }
    }, [...position, ...size, layerPadPerc]);
    
    // Update the positions/size when a new element is added or removed
    useEffect(() => {
        if(!transitionActive) {
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
        if (!parentSelected) setGroupSelected(false);
    }, [parentSelected]);


    /* RESPOND TO CHILD COMPONENT CHANGES */
    const stackHandler = () => {
        if(inActiveField) {
            if(groupSelected) {
                collapseStack(path, currentFieldPaths, parentFocus);
                changePositions(false);
            } else if(inTopField) {
                expandStack(path, nextFieldPaths, nextFocus);
                changePositions(true);
            };
        };
    };

    const changePositions = async (expand) => {
        if(expand) {
            setChildPositions(raisedPositions);
            await delay (500);
            setChildPositions(trueFieldPositions);
            setChildSize(fieldElementSize);
            setGroupSelected(true);
        } else {
            setGroupSelected(false);
            setChildPositions(raisedPositions);
            setChildSize(cubeElementSize);
            await delay(500);
            setChildPositions(defaultPositions);
        }
    }

    // Animate group-level changes
    const aProps = useSpring({
        gPosition: groupPosition
    });

    return (
        <a.mesh position={aProps.gPosition}>

            <ArrayCube
                element={groupArray}
                position={position}
                size={size} 
                opacity={opacity}
                index={index}
                path={path}
                setGroupPosition={setGroupPosition}
                stackHandler={stackHandler}
                isOverridden={isOverridden}
                parentSelected={parentSelected}
                inActiveField={inActiveField}
                inTopField={inTopField}
                inActiveRoots={inActiveRoots}
                font={font}/>

            {groupArray.map((lowerElement, i) => {
                return !childPositions[i] ? null : Array.isArray(lowerElement) ? (
                    <ConnectedCubeGroup 
                        groupArray={lowerElement}
                        index={i}
                        path={nextFieldPaths[i]}
                        currentFieldPaths={nextFieldPaths}
                        position={childPositions[i].map(vec => vec/2)}
                        size={childSize}
                        opacity={opacity}

                        parentSelected={groupSelected}
                        parentOverridden={isOverridden}
                        parentFieldDim={newFieldDim}
                        parentFieldOffset={newFieldOffset}
                        parentFocus={nextFocus}
                        font={font}
                        key={nextFieldPaths[i].join(',')}/>
                ) : (
                    <PrimCube
                        element={lowerElement}
                        index={i}
                        path={nextFieldPaths[i]}
                        position={childPositions[i]}
                        size={childSize}
                        opacity={opacity}

                        groupSelected={groupSelected}
                        parentOverridden={isOverridden}
                        inActiveField={inActiveRoots}
                        inTopField={isTopRoot}
                        font={font}
                        key={nextFieldPaths[i].join(',')}/>
                )
            })}
        </a.mesh>
    )
}

const mapStateToProps = state => ({
    transitionActive: state.view.transitionActive,
    editorState: state.view.editorState,

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
    transitionActive: PropTypes.bool,
    editorState: PropTypes.object,

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
    expandStack, collapseStack, refocusStack
})(CubeGroup);

export default ConnectedCubeGroup;