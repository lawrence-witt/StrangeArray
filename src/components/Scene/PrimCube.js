/* Dependencies */
import React, { useRef, useMemo, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import delay from 'delay';
import * as THREE from 'three';

import { deleteFromArray } from '../../redux/actions/arrayActions';

const PrimCube = props => {
    const {position, size, opacity, path, parentSidelined} = props;
    const {deletionActive, deleteFromArray, activeFieldElements, topFieldLayer} = props;

    const [activityState, setActivityState] = useState('collapsed');


    /* RESPOND TO REDUX CHANGES */
    const inActiveField = useMemo(() => activeFieldElements.some(el => el.join(',') === path.join(',')), [activeFieldElements]);
    const inTopField = useMemo(() => topFieldLayer.some(el => el.join(',') === path.join(',')), [topFieldLayer]);

    useEffect(() => {
        inTopField ?
            setActivityState('focussed') :
        (inActiveField && !inTopField) || parentSidelined ?
            setActivityState('overriden') :
            setActivityState('collapsed');
    }, [inActiveField, inTopField, parentSidelined]);


    /* RESPOND TO PARENT CHANGES */
    const [cubePosition, setCubePosition] = useState(position);
    const [cubeSize, setCubeSize] = useState(size);

    useEffect(() => {
        setCubePosition(position);
        setCubeSize(size);
    }, [position, size]);


    /* RESPOND TO CLICK EVENT */
    const primClickHandler = e => {
        if(deletionActive && inTopField) {
            e.stopPropagation();
            deleteFromArray(path);
        } else if(deletionActive) {
            e.stopPropagation();
        }
    }

    // Animate Changes
    const aProps = useSpring({
        cPosition: cubePosition,
        cSize: cubeSize,
        cOpacity: activityState === 'overriden' ? 0.2 : opacity
    });

    return (
        <a.mesh position={aProps.cPosition} scale={aProps.cSize} onClick={e => primClickHandler(e)}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]}/>
            <a.meshPhongMaterial attach="material" transparent color="hotpink" opacity={aProps.cOpacity}/>
        </a.mesh>
    )
}

const mapStateToProps = state => ({
    deletionActive: state.view.deletionActive,

    activeFieldElements: state.stack.activeFieldElements,
    topFieldLayer: state.stack.topFieldLayer
});

PrimCube.propTypes = {
    deletionActive: PropTypes.bool,

    activeFieldElements: PropTypes.array,
    topFieldLayer: PropTypes.array
};

export default connect(mapStateToProps, { deleteFromArray })(PrimCube);