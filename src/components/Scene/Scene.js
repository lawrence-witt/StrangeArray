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
import PrimCube from './PrimCube';
import Pedestal from './Pedestal';
import { getFieldData, compensateFieldPositions } from '../../utils/Calculator';
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
        camera.position.set(5, 5, 7);
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

    const { view, hoverActive, demoArray, userArray, focusPosition, masterBasePosition, baseFieldSize, unitPadPerc, layerPadPerc} = props;

    const [currentArray, setCurrentArray] = useState(demoArray);

    const pedestalSize = [baseFieldSize, baseFieldSize*2, baseFieldSize];
    const fieldDim = Math.ceil(Math.sqrt(currentArray.length));

    // Swap out the arrays during view transition
    useEffect(() => {
        view === 'edit' ? setCurrentArray(userArray) : 
                          setCurrentArray(demoArray);
    }, [view]);

    // Update the active array when its elements change
    useEffect(() => {
        if (view === 'edit') setCurrentArray(userArray);
    }, [userArray])

    // Load Font
    const font = useLoader(THREE.FontLoader, '../fonts/Consolas_Regular.typeface.json');

    const { rawFieldPositions, fieldElementSize } = getFieldData(fieldDim, masterBasePosition, baseFieldSize, unitPadPerc);

    return (
        <div className={`canvas-container ${hoverActive ? 'hovered' : ''}`}>
            <Canvas
                onCreated={({ gl }) => {
                gl.sortObjects = false;
            }}>
            <Controls focusPosition={focusPosition}/>
            <ambientLight/>
            <SceneLight focusPosition={focusPosition} baseFieldSize={baseFieldSize}/>
            <Pedestal pedestalSize={pedestalSize} fieldElementSize={fieldElementSize} masterBasePosition={masterBasePosition}/>
            <Provider store={store}>
            {currentArray.map((lowerElement, i) => {
                return Array.isArray(lowerElement) ? (
                    <ConnectedCubeGroup 
                        groupArray={lowerElement}
                        index={i}
                        path={[i.toString()]}
                        depth={1}
                        currentFieldPaths={currentArray.map((e, i) => [i.toString()])}
                        position={rawFieldPositions[i].map(vec => vec/2)}
                        size={fieldElementSize}
                        opacity={1}

                        parentSelected={true}
                        parentOverridden={false}
                        parentFieldDim={fieldDim}
                        parentFieldOffset={masterBasePosition}
                        parentFocus={0}
                        font={font}
                        key={[i].join(',')}/>
                ) : (
                    <PrimCube
                        element={lowerElement}
                        index={i}
                        path={[i.toString()]}
                        position={rawFieldPositions[i]}
                        size={fieldElementSize}
                        opacity={1}

                        groupSelected={true}
                        parentOverridden={false}
                        font={font}
                        key={[i].join(',')}/>
                )
            })}
            </Provider>
            </Canvas>
        </div>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    hoverActive: state.view.hoverActive,

    demoArray: state.stack.demoArray,
    userArray: state.stack.userArray,

    focusPosition: state.stack.focusPosition,
    masterBasePosition: state.stack.masterBasePosition,
    baseFieldSize: state.stack.baseFieldSize,
    unitPadPerc: state.stack.unitPadPerc,
    layerPadPerc: state.stack.layerPadPerc
});

Scene.propTypes = {
    view: PropTypes.string,
    hoverActive: PropTypes.bool,

    demoArray: PropTypes.array,
    userArray: PropTypes.array,

    focusPosition: PropTypes.array,
    masterBasePosition: PropTypes.array,
    baseFieldSize: PropTypes.number,
    unitPadPerc: PropTypes.number,
    layerPadPerc: PropTypes.number
}

export default connect(mapStateToProps)(Scene);