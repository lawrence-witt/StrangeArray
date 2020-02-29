/* Dependencies */
import React, { Suspense, useRef, useState, useEffect, useMemo} from 'react';
import { Provider, connect } from 'react-redux';
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
import { usePrevious } from '../../utils/CustomHooks';

extend({ OrbitControls });

const Controls = props => {
    const { focusPosition } = props;
    const { camera, gl } = useThree();
    const orbitRef = useRef();

    const [ targetY, setTargetY ] = useState(focusPosition[1]);
    const [ prevTargetY, setPrevTargetY ] = useState(targetY);

    const [ positionY, setPositionY ] = useState(camera.position.y);
    const [ refocusActive, setRefocusActive ] = useState(false);

    useEffect(() => {
        camera.position.set(10, 10, 10);
    }, [])

    useEffect(() => {
        setPrevTargetY(targetY);
        setTargetY(focusPosition[1]);
    }, [focusPosition]);

    useEffect(() => {
        if(targetY !== prevTargetY) {
            setPositionY(camera.position.y);
            setRefocusActive(true);
        }
    }, [targetY])

    const { targetSpring } = useSpring({
      from: { targetSpring: prevTargetY },
      targetSpring: targetY
    })

    const { positionSpring } = useSpring({
        from: { positionSpring: positionY },
        positionSpring: targetY,
        onRest: () => setRefocusActive(false)
    });
  
    useFrame(() => {
        if (orbitRef.current.target.y !== targetY) {
            orbitRef.current.target.y = targetSpring.value;
        };

        if (camera.position.y < targetY && refocusActive) {
            camera.position.y = positionSpring.value
        };
        orbitRef.current.update()
    })
  
    return (
        <orbitControls 
          args={[camera, gl.domElement]}
          ref={orbitRef}
          enableDamping
        />
    )
}

const SceneLight = props => {
    const { focusPosition, baseFieldSize } = props;

    const aProps = useSpring({
        spotTarget: focusPosition,
        spotPosition: [focusPosition[0], focusPosition[1]+baseFieldSize*2, focusPosition[2]]
    });

    const light = useMemo(() => new THREE.SpotLight(0xffffff, 0.5), []);

    return (
        <>
        <a.primitive object={light} position={aProps.spotPosition}/>
        <primitive object={light.target} position={[0, 0, 0]}/>
        </>
    )
}

const Scene = props => {

    const { view, demoArray, userArray, focusPosition, masterBasePosition, baseFieldSize, unitPadPerc} = props;

    const [currentArray, setCurrentArray] = useState(demoArray);

    const baseSize = new Array(3).fill(baseFieldSize-unitPadPerc);
    const fieldDim = Math.ceil(Math.sqrt(currentArray.length));

    useEffect(() => {
        view === 'edit' ? setCurrentArray(userArray) : 
                          setCurrentArray(demoArray);
    }, [view]);

    useEffect(() => {
        if (view === 'edit') setCurrentArray(userArray);
    }, [userArray])

    return (
        <Canvas
            onCreated={({ gl }) => {
            gl.sortObjects = false;
        }}>
        <Controls focusPosition={focusPosition}/>
        <ambientLight />
        <SceneLight focusPosition={focusPosition} baseFieldSize={baseFieldSize}/>
        <Provider store={store}>
            <ConnectedCubeGroup 
            groupArray={currentArray}
            path={['base']}
            depth={0}
            currentFieldPaths={[['base']]}

            position={masterBasePosition}
            size={baseSize}
            opacity={1}
            parentFieldDim={fieldDim}
            parentFieldOffset={masterBasePosition}
            parentFocus={0}
            parentSelected={true}
            parentLightActive={true}
            parentSidelined={false}
            />
        </Provider>
        </Canvas>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,

    demoArray: state.array.demoArray,
    userArray: state.array.userArray,

    focusPosition: state.stack.focusPosition,
    masterBasePosition: state.stack.masterBasePosition,
    baseFieldSize: state.stack.baseFieldSize,
    unitPadPerc: state.stack.unitPadPerc,
    layerPadPerc: state.stack.layerPadPerc
});

Scene.propTypes = {
    view: PropTypes.string,

    demoArray: PropTypes.array,
    userArray: PropTypes.array,

    focusPosition: PropTypes.array,
    masterBasePosition: PropTypes.array,
    baseFieldSize: PropTypes.number,
    unitPadPerc: PropTypes.number,
    layerPadPerc: PropTypes.number
}

export default connect(mapStateToProps)(Scene);