/* Dependencies */
import React, { Suspense, useRef, useState, useEffect} from 'react';
import { Provider, connect, ReactReduxContext } from 'react-redux';
import delay from 'delay';
import PropTypes from 'prop-types';

// Three Dependencies
import { Canvas, useFrame, useThree, extend, useLoader} from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

// Imported Sheets
import store from '../../redux/store';
import ConnectedCubeGroup from './CubeGroup';
import { getFieldData } from '../../utils/Calculator';

extend({ OrbitControls });

const Controls = () => {
    const { camera, gl } = useThree();
    const orbitRef = useRef();
  
    camera.position.set(2, 2, 2);
  
    useFrame(() => {
      orbitRef.current.update()
    })
  
    return (
        <orbitControls 
          args={[camera, gl.domElement]}
          ref={orbitRef}
          enableDamping
          target={[0, 0, 0]}
        />
    )
}

const Scene = props => {

    const { baseArray, masterBasePosition, baseFieldSize, unitPadPerc, layerPadPerc } = props;

    const fieldDim = Math.ceil(Math.sqrt(baseArray.length));

    const { fieldElementSize } = getFieldData(fieldDim, masterBasePosition, baseFieldSize, unitPadPerc);

    return (
        <Canvas>
        <Controls />
        <ambientLight />
        <spotLight position={[4, 4, 4]} intensity={0.5}/>
        <Provider store={store}>
            <ConnectedCubeGroup 
                groupArray={baseArray}
                path={['base']}
                position={masterBasePosition}
                size={fieldElementSize}
                parentFieldDim={fieldDim}
                parentFieldOffset={masterBasePosition}
                parentSelected={true}
            />
        </Provider>
        </Canvas>
    )
}

const mapStateToProps = state => ({
    baseArray: state.array.baseArray,
    
    masterBasePosition: state.stack.masterBasePosition,
    baseFieldSize: state.stack.baseFieldSize,
    unitPadPerc: state.stack.unitPadPerc,
    layerPadPerc: state.stack.layerPadPerc
});

Scene.propTypes = {
    baseArray: PropTypes.array,
    masterBasePosition: PropTypes.array,
    baseFieldSize: PropTypes.number,
    unitPadPerc: PropTypes.number,
    layerPadPerc: PropTypes.number
}

export default connect(mapStateToProps)(Scene);