// Dependencies
import React, { useState, useEffect, useRef, useMemo} from 'react';
import { useSpring, a } from 'react-spring/three';
import { useLoader } from 'react-three-fiber';
import * as THREE from 'three';

import graniteNormal from '../../assets/textures/graniteNormal.jpg';

const Pedestal = props => {
    const { pedestalSize, fieldElementSize, maxY, setStackOpacity } = props;
    const isMounted = useRef(false);

    const normal = useLoader(THREE.TextureLoader, graniteNormal);
    normal.wrapS = THREE.RepeatWrapping;
    normal.wrapT = THREE.RepeatWrapping;
    normal.repeat.set(1, 1.5);

    // Display Config
    const [pedestalConfig, setPedestalConfig] = useState({
        ready: false,
        configPosition: [0, 0, 0]
    });
    const { ready, configPosition } = pedestalConfig;
    const color = useMemo(() => new THREE.Color('darkslategrey'), []);

    useEffect(() => {
        if(fieldElementSize[1]) {
            setPedestalConfig({
                ready: true,
                configPosition: [0, maxY, 0]
            });
        }
    }, [...fieldElementSize]);

    const pedestal = useSpring({
        position: ready ? configPosition : [0, -50, 0],
        size: ready ? pedestalSize : [0, 0, 0],
        onRest: () => {
            if(ready && !isMounted.current) {
                setStackOpacity(1);
                isMounted.current = true;
            }
        }
    });

    return (
        <a.mesh
          position={pedestal.position}
          scale={pedestal.size}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]}/>
            <meshStandardMaterial 
                metalness={0.2} 
                roughness={0.3} 
                attach="material"
                normalMap={normal}
                normalScale={[0.5, 0.5]}
                color={color} 
                transparent/>
        </a.mesh>
    )
}

export default Pedestal;