import React, { useRef, useMemo, useState, useEffect} from 'react';
import { useSpring, a } from 'react-spring/three';
import * as THREE from 'three';

const IndexMarker = props => {
    const { font, layerGapFactor, inTopField } = props;
    const index = JSON.stringify(props.index);

    const rawScale = layerGapFactor/100;

    const scaleCalc = inTopField || rawScale > 0.25 ? 0.25 : 
                                    rawScale > 0 ? rawScale : 0.001;

    const indexScale = new Array(3).fill(scaleCalc);

    const indexSpring = useSpring({
        scale: indexScale
    })

    const config = useMemo(() => ({
        font, hAlign: "center", size: 1, height: 0.25
    }), [font]);

    const color = useMemo(() => new THREE.Color('gold'), []);

    return (
        <a.mesh position={[-0.5, 0.51, -0.5]} scale={indexSpring.scale}>
            <textGeometry attach="geometry" args={[index, config]}/>
            <meshBasicMaterial attach="material" color={color}/>
        </a.mesh>
    )
}

export default IndexMarker;