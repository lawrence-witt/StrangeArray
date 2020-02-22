/* Dependencies */
import React, { Suspense, useRef, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import delay from 'delay';
import PropTypes from 'prop-types';

// Three Dependencies
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import * as THREE from 'three';

// Imported Sheets
import { getCubeData, getFieldData, compensateFieldPositions } from '../../utils/Calculator';
import ArrayCube from './ArrayCube';
import PrimCube from './PrimCube';
import { expandStack } from '../../redux/actions/stackActions';

const CubeGroup = props => {
    // Position Config
    const { groupArray, path, position, size, parentSelected, parentFieldDim, parentFieldOffset } = props;
    const { masterBasePosition, baseFieldSize, unitPadPerc, layerPadPerc, activeFieldElements, topLayer, expandStack } = props;

    const newFieldDim = Math.ceil(Math.sqrt(groupArray.length)) > parentFieldDim ? Math.ceil(Math.sqrt(groupArray.length)) : parentFieldDim;

    let { defaultPositions, raisedPositions, cubeElementSize } = getCubeData(groupArray, position, size, unitPadPerc);
    let { rawFieldPositions, fieldElementSize } = getFieldData(newFieldDim, masterBasePosition, baseFieldSize, unitPadPerc);
    let { trueFieldPositions, newFieldOffset } = compensateFieldPositions(rawFieldPositions, position, size, fieldElementSize, parentFieldOffset, layerPadPerc);

    // Internal State
    const pathString = path.join('');
    const [selected, setSelected] = useState(false);
    const [groupPosition, setGroupPosition] = useState(position);
    const [childPositions, setChildPositions] = useState(defaultPositions);
    const [childSize, setChildSize] = useState(cubeElementSize);
    
    // Respond to Redux Changes
    const lProps = useSpring({
        pointInt: activeFieldElements.includes(pathString) && parentSelected ? 0.5 : 0
    })

    // Respond to Parent Component Changes
    useEffect(() => {
        console.log('position effect');
        setGroupPosition(position);
        setChildPositions(defaultPositions);
        setChildSize(cubeElementSize);
    }, [position]);

    useEffect(() => {
        if (!parentSelected) setSelected(false);
    }, [parentSelected]);

    const gProps = useSpring({
        gPosition: groupPosition
    });

    // Respond to Child Component Changes
    // The issue is that the whole component rerenders when it recieves new redux props
    const selectionHandler = () => {
        if (selected) {
            changePositions(false);
        } else {
            const newFieldElements = groupArray.map((e, i) => pathString+i);
            expandStack(pathString, newFieldElements);
            changePositions(true);
        }
    }

    const changePositions = async (upwards) => {
        if(upwards) {
            setSelected(true);
            setChildPositions(raisedPositions);
            await delay (500);
            setChildPositions(trueFieldPositions);
            setChildSize(fieldElementSize);
        } else {
            setSelected(false);
            setChildPositions(raisedPositions);
            setChildSize(cubeElementSize);
            await delay(500);
            setChildPositions(defaultPositions);
        }
    }

    return (
        <a.group position={gProps.gPosition}>

            <a.pointLight 
              position={gProps.gPosition} 
              intensity={lProps.pointInt}
              distance={size[0]*2}/>
            <ArrayCube position={position} size={size} path={path} selectionHandler={selectionHandler} selected={selected}/>

            {groupArray.map((lowerElement, i) => {
                return Array.isArray(lowerElement) ? (
                    <ConnectedCubeGroup 
                        groupArray={lowerElement}
                        path={[...path, i]}
                        position={childPositions[i].map(vec => vec/2)}
                        size={childSize}
                        parentSelected={selected}
                        parentFieldDim={newFieldDim}
                        parentFieldOffset={newFieldOffset}
                        key={[...path, i]}/>
                ) : (
                    <PrimCube
                        path={[...path, i]} 
                        position={childPositions[i]}
                        size={childSize}
                        key={[...path, i]}/>
                )
            })}
        </a.group>
    )
}

const mapStateToProps = state => ({
    masterBasePosition: state.stack.masterBasePosition,
    baseFieldSize: state.stack.baseFieldSize,
    unitPadPerc: state.stack.unitPadPerc,
    layerPadPerc: state.stack.layerPadPerc,

    activeFieldElements: state.stack.activeFieldElements,
    topLayer: state.stack.topLayer
});

CubeGroup.propTypes = {
    masterBasePosition: PropTypes.array,
    baseFieldSize: PropTypes.number,
    unitPadPerc: PropTypes.number,
    layerPadPerc: PropTypes.number,

    activeFieldElements: PropTypes.array,
    topLayer: PropTypes.string
};

const ConnectedCubeGroup = connect(mapStateToProps, {expandStack})(CubeGroup);

export default ConnectedCubeGroup;