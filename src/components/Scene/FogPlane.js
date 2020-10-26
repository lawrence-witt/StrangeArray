import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSpring, a } from 'react-spring/three';
import * as THREE from 'three';
import { useLoader, useFrame } from 'react-three-fiber';

import fogmap from '../../assets/textures/fogmap.jpg';

export default function FogPlane({maxY}) {
    const fogRef1 = useRef();
    const fogRef2 = useRef();
    const fogTexture = useLoader(THREE.TextureLoader, fogmap);
    const [yPosition, setYPosition] = useState(maxY*1.35 + maxY*1.35/2);
    const [fogConfig, setFogConfig] = useState({
        opacity: 0,
        one: {
            rotation: 0.1,
            position: yPosition+0.5
        },
        two: {
            rotation: 0.1,
            position: yPosition+1
        },
        three: {
            position: yPosition+0.2
        }
    });
    const {opacity, one, two, three} = fogConfig;

    const color1 = useMemo(() => new THREE.Color('snow'), []);
    const color2 = useMemo(() => new THREE.Color('slategrey'), []);

    useEffect(() => {
        if(maxY) {
            const resetY = maxY*1.35 + maxY*1.35/2
            setYPosition(resetY);
            setFogConfig({
                ...fogConfig,
                one: {
                    ...one,
                    position: resetY+0.5
                },
                two: {
                    ...two,
                    position: resetY+1
                },
                three: {
                    position: resetY+0.2
                }
            })
        }
    }, [maxY]);

    const aProps = useSpring({
        position1: [0, one.position, 0],
        position2: [0, two.position, 0],
        position3: [0, three.position, 0]
    });

    useFrame(() => {
        setFogConfig({
            ...fogConfig,
            opacity: opacity < 1 ? opacity + 0.01 : opacity,
            one: {
                ...one,
                rotation: one.rotation + 0.005,
            },
            two: {
                ...two,
                rotation: two.rotation - 0.005,
            },
        });
        fogRef1.current.rotation.z = one.rotation;
        fogRef2.current.rotation.z = two.rotation;
    });

    return (
        <mesh>
        <a.mesh ref={fogRef1} rotation={[-Math.PI / 2, 0, 0]} position={aProps.position1} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[350, 350]}/>
            <meshBasicMaterial alphaMap={fogTexture} attach="material" opacity={opacity} color={color1} transparent/>
        </a.mesh>
        <a.mesh ref={fogRef2} rotation={[-Math.PI / 2, 0, 0]} position={aProps.position2} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[350, 350]}/>
            <meshBasicMaterial alphaMap={fogTexture} attach="material" opacity={opacity} color={color2} transparent/>
        </a.mesh>
        <a.mesh rotation={[-Math.PI / 2, 0, 0]} position={aProps.position3}>
            <planeBufferGeometry attach="geometry" args={[350, 350]}/>
            <meshBasicMaterial attach="material" color="black"/>
        </a.mesh>
        </mesh>
    )
};