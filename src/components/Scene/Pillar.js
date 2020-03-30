import React, { useMemo, useState, useEffect } from 'react';
import { useSpring, a } from 'react-spring/three';
import * as THREE from 'three';

import {getBoxVertices, boxFaces} from '../../utils/PillarCalculator';

export default function Pillar({position, scale, smallest, texture}) {

    const boxVertices = useMemo(() => getBoxVertices(smallest), []);
    const vertices = useMemo(() => boxVertices.map(v => new THREE.Vector3(...v)), []);
    const faces = useMemo(() => boxFaces.map(f => new THREE.Face3(...f)), []);

    const [ready, setReady] = useState(false);

    useEffect(() => {
        const ran = Math.floor(Math.random()*500);
        const timer = setTimeout(() => {
            setReady(true);
        }, ran);
        return () => clearTimeout(timer);
    }, [])

    const aProps = useSpring({
        position: ready ? position : [0, -50, 0],
        scale: ready ? scale : [0, 0, 0]
    });  

    const color = useMemo(() => {
        const ran = Math.floor(Math.random()*10) + 35;
        return new THREE.Color(`hsl(0, 0%, ${ran}%)`)
    }, []);

    const rotation = useMemo(() => {
        const ran = Math.floor(Math.random()*4);
        return ran === 0 
        ? Math.PI/2 
        : ran === 1 
        ? Math.PI/2 * 2 
        : ran === 2 
        ? Math.PI/2 * 3 
        : 0;
    }, [])

    return (
        <a.mesh position={aProps.position} rotation={[0, rotation, 0]} scale={aProps.scale}>
            <geometry attach="geometry" vertices={vertices} faces={faces} onUpdate={self => self.computeFaceNormals()}/>
            <meshLambertMaterial map={texture} attach="material" color={color}/>
        </a.mesh>
    )
}