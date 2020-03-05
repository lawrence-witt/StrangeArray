import React, { useRef, useMemo, useState, useEffect} from 'react';
import { useSpring, a } from 'react-spring/three';

const IndexMarker = props => {
    const { font, cubeSize } = props;
    const index = JSON.stringify(props.index);

    // Size should be calculate with layer padding in mind
    const config = useMemo(() => ({
        font, hAlign: "center", size: cubeSize[0]/10, height: cubeSize[0]/50
    }), [font, cubeSize]);

    return (
        <mesh position={[-0.5, 0.6, -0.5]}>
            <textGeometry attach="geometry" args={[index, config]}/>
            <meshPhysicalMaterial attach="material" color="red"/>
        </mesh>
    )
}

export default IndexMarker;