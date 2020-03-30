// Dependencies
import React, { useRef, useState, useEffect, useMemo, Suspense} from 'react';
import { Provider, connect } from 'react-redux';
import delay from 'delay';
import PropTypes from 'prop-types';

// Three Dependencies
import { Canvas, useLoader} from 'react-three-fiber';
import * as THREE from 'three';

// Imported Sheets
import store from '../../redux/store';
import { completeTransition } from '../../redux/actions/viewActions';
import { getBaseFieldData } from '../../utils/GeometryCalculator';

import SceneLight from './SceneLight';
import Controls from './Controls';
import ConnectedCubeGroup from './CubeGroup';
import PrimCube from './PrimCube';
import Pedestal from './Pedestal';
import Pillars from './Pillars';
import FogPlane from './FogPlane';
import Stars from './Stars';

const Scene = props => {
    const { view, transitionActive, completeTransition, hoverActive, demoArray, userArray, focusPosition, masterBasePosition, baseFieldSize, unitPadPerc, layerPadPerc, activeRoots} = props;

    // Active Array State
    const [currentArray, setCurrentArray] = useState(demoArray);

    // Base Position/Size Config
    const fieldDim = Math.ceil(Math.sqrt(currentArray.length));
    const { fieldPositions, fieldElementSize } = getBaseFieldData(fieldDim, masterBasePosition, baseFieldSize, unitPadPerc);
    const transitionedPositions = fieldPositions.reduce((a, c) => [...a, [c[0], c[1]+baseFieldSize, c[2]]], []);
    const layerGapFactor = layerPadPerc*(100/fieldElementSize[0]);

    // Pedestal/Pillar Config
    const pedestalSize = useMemo(() => [baseFieldSize, baseFieldSize*1.5, baseFieldSize], [baseFieldSize]);
    // This is always the centrepoint of the pedestal
    const maxY = masterBasePosition[1] - pedestalSize[1]*0.55 - fieldElementSize[1]/2;

    // Internal State
    const [stackActive, setStackActive] = useState(true);
    const [stackPosition, setStackPosition] = useState(fieldPositions);
    const [stackOpacity, setStackOpacity] = useState(0);
    const [stackSuspended, setStackSuspended] = useState(false);
    const isMounted = useRef(false);

    // Handle Transition Between User And Demo Arrays
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

    // Update The Stack When Array Elements Change
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
                camera={{position: [6, -4, 15]}}
                onCreated={({ gl }) => {
                gl.sortObjects = false;
            }}>
            <Controls 
                focusPoint={focusPosition[1]}/>
            <ambientLight/>
            <fogExp2 attach="fog" args={["black", 0.0175]}/>
            <Stars />
            <Suspense fallback={null}>
                <FogPlane maxY={maxY}/>
                <Pillars
                pedestalSize={pedestalSize}
                maxY={maxY}/>
                <Pedestal
                pedestalSize={pedestalSize}
                maxY={maxY}
                fieldElementSize={fieldElementSize}
                setStackOpacity={setStackOpacity}/>
            </Suspense>
            <SceneLight 
                focusPosition={focusPosition} 
                baseFieldSize={baseFieldSize}/>
            
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