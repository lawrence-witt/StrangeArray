// Dependencies
import React, { useRef, useState, useEffect, useMemo} from 'react';
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
import { completeTransition } from '../../redux/actions/viewActions';

import ConnectedCubeGroup from './CubeGroup';
import PrimCube from './PrimCube';
import Pedestal from './Pedestal';
import { getBaseFieldData } from '../../utils/Calculator';

extend({ OrbitControls });

const Controls = ({focusPoint}) => {
    const { camera, gl } = useThree();
    const orbitRef = useRef();

    const [positionY, setPositionY] = useState({
        active: false,
        curr: 0,
        next: 0
    })

    useEffect(() => {
        setPositionY({active: true, curr: camera.position.y, next: focusPoint})
    }, [focusPoint]);

    const { targetSpring } = useSpring({
      targetSpring: focusPoint
    });
  
    useFrame(() => {
        if (orbitRef.current.target.y !== focusPoint) {
            orbitRef.current.target.y = targetSpring.value;
        };

        if (camera.position.y < positionY.next && positionY.active) {
            setPositionY({...positionY, curr: positionY.curr + 0.25});
            camera.position.y = positionY.curr;
        } else if(camera.position.y > positionY.next && positionY.active) {
            setPositionY({...positionY, active: false});
        } else if(camera.position.y < -2) camera.position.y = -2;
        
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
    const { view, transitionActive, completeTransition, hoverActive, demoArray, userArray, focusPosition, masterBasePosition, baseFieldSize, unitPadPerc, layerPadPerc, activeRoots} = props;

    // Active array state
    const [currentArray, setCurrentArray] = useState(demoArray);

    // Position/size config
    const pedestalSize = useMemo(() => [baseFieldSize, baseFieldSize*1.5, baseFieldSize], [baseFieldSize]);
    const fieldDim = Math.ceil(Math.sqrt(currentArray.length));
    const { fieldPositions, fieldElementSize } = getBaseFieldData(fieldDim, masterBasePosition, baseFieldSize, unitPadPerc);
    const transitionedPositions = fieldPositions.reduce((a, c) => [...a, [c[0], c[1]+baseFieldSize, c[2]]], []);
    const layerGapFactor = layerPadPerc*(100/fieldElementSize[0]);

    // Internal state
    const [stackActive, setStackActive] = useState(true);
    const [stackPosition, setStackPosition] = useState(fieldPositions);
    const [stackOpacity, setStackOpacity] = useState(0);
    const [stackSuspended, setStackSuspended] = useState(false);
    const isMounted = useRef(false);

    // Handle transition between user and demo arrays
    useEffect(() => {
        if(isMounted.current) {
            if(transitionActive) {
                async function staggerTransitionOut() {
                    setStackActive(false);
                    setStackPosition(transitionedPositions);
                    setStackOpacity(0);
                    await delay(400);
                    setStackSuspended(true);
                    view === 'home' ? setCurrentArray(userArray) : 
                                      setCurrentArray(demoArray);
                    completeTransition();
                }
                staggerTransitionOut();
            } else {
                async function staggerTransitionIn() {
                    setStackPosition(transitionedPositions);
                    await delay(400);
                    setStackActive(true);
                    setStackSuspended(false);
                    setStackOpacity(1);
                    setStackPosition(fieldPositions);
                }
                staggerTransitionIn();
            }
        } else {
            isMounted.current = true;
        }
    }, [transitionActive]);

    // Update the stack when array elements change
    useEffect(() => {
        if (view === 'edit'){
            setCurrentArray(userArray);
        }
    }, [userArray]);

    useEffect(() => {
        setStackPosition(fieldPositions);
    }, [currentArray]);

    // Load Index Marker Font
    const font = useLoader(THREE.FontLoader, '../fonts/Consolas_Regular.typeface.json');

    return (
        <div className={`canvas-container ${hoverActive ? 'hovered' : ''}`}>
            <Canvas
                camera={{position: [5, 5, 7]}}
                onCreated={({ gl }) => {
                gl.sortObjects = false;
            }}>
            <Controls 
                focusPoint={focusPosition[1]}/>
            <ambientLight/>
            <SceneLight 
                focusPosition={focusPosition} 
                baseFieldSize={baseFieldSize}/>
            <Pedestal
                pedestalSize={pedestalSize} 
                fieldElementSize={fieldElementSize} 
                masterBasePosition={masterBasePosition} 
                setStackOpacity={setStackOpacity}/>
            <Provider store={store}>
            {stackSuspended ? null : currentArray.map((lowerElement, i) => {
                return !stackPosition[i] ? null : Array.isArray(lowerElement) ? (
                    <ConnectedCubeGroup 
                        groupArray={lowerElement}
                        index={i}
                        path={[i.toString()]}
                        currentFieldPaths={currentArray.map((e, i) => [i.toString()])}
                        position={stackPosition[i].map(vec => vec/2)}
                        size={fieldElementSize}
                        opacity={stackOpacity}

                        parentSelected={stackActive}
                        parentOverridden={false}
                        parentFieldDim={fieldDim}
                        parentFieldOffset={masterBasePosition}
                        parentFocus={0}

                        layerGapFactor={layerGapFactor}
                        font={font}
                        key={[i].join(',')}/>
                ) : (
                    <PrimCube
                        element={lowerElement}
                        index={i}
                        path={[i.toString()]}
                        position={stackPosition[i]}
                        size={fieldElementSize}
                        opacity={stackOpacity}

                        groupSelected={stackActive}
                        parentOverridden={false}
                        inActiveField={true}
                        inTopField={activeRoots.length === 0}

                        layerGapFactor={layerGapFactor}
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
    transitionActive: state.view.transitionActive,
    hoverActive: state.view.hoverActive,

    demoArray: state.stack.demoArray,
    userArray: state.stack.userArray,

    focusPosition: state.stack.focusPosition,
    masterBasePosition: state.stack.masterBasePosition,
    baseFieldSize: state.stack.baseFieldSize,
    unitPadPerc: state.stack.unitPadPerc,
    layerPadPerc: state.stack.layerPadPerc,

    activeRoots: state.stack.activeRoots
});

Scene.propTypes = {
    view: PropTypes.string,
    transitionActive: PropTypes.bool,
    hoverActive: PropTypes.bool,

    demoArray: PropTypes.array,
    userArray: PropTypes.array,

    focusPosition: PropTypes.array,
    masterBasePosition: PropTypes.array,
    baseFieldSize: PropTypes.number,
    unitPadPerc: PropTypes.number,
    layerPadPerc: PropTypes.number,

    activeRoots: PropTypes.array
}

export default connect(mapStateToProps, { completeTransition })(Scene);