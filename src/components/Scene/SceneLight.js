import React, { useMemo, useEffect, useState } from 'react';
import { useSpring, a } from 'react-spring/three';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';

export default function SceneLight({focusPosition, baseFieldSize}) {
    const { camera } = useThree();

    const [moveSpot, setMoveSpot] = useState([
        camera.position.x,
        camera.position.y,
        camera.position.z
    ]);

    const aProps = useSpring({
        position: [focusPosition[0], focusPosition[1]+baseFieldSize*2, focusPosition[2]],
        target: focusPosition
    });

    const topLight = useMemo(() => new THREE.SpotLight(0xffffff, 0.5), []);
    const moveLight = useMemo(() => new THREE.SpotLight(0xffffff, 0.5, 0, Math.PI/4, 0.5), []);

    useFrame(() => {
        setMoveSpot([camera.position.x, camera.position.y, camera.position.z]);
    });

    return (
        <>
            <a.primitive object={topLight} position={aProps.position}/>
            <primitive object={topLight.target} position={[0, 0, 0]}/>
        
            <primitive object={moveLight} position={moveSpot}/>
            <a.primitive object={moveLight.target} position={aProps.target}/>
        
        </>
    )
}