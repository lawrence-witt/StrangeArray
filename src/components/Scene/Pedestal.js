// Dependencies
import React, { useState, useEffect, useRef} from 'react';
import { useSpring, a } from 'react-spring/three';
import * as THREE from 'three';

const Pedestal = props => {
    const { pedestalSize, fieldElementSize, masterBasePosition, setStackOpacity } = props;
    const isMounted = useRef(false);

    const vertexShader = `
        attribute float alphaValue;
        varying float vAlphaValue;

        void main()	{
            vAlphaValue = alphaValue;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `

    const fragmentShader = `
        varying float vAlphaValue;

        void main() {
            gl_FragColor = vec4( vec3( 0.46, 0.53, 0.6 ), vAlphaValue );
        }
    `

    const alphaArray = new Float32Array([
        0.4, 0.4, 0, 0, 
        0.4, 0.4, 0, 0,     
        1, 1, 1, 1,
        0, 0, 0, 0,
        0.4, 0.4, 0, 0,      
        0.4, 0.4, 0, 0,   
    ]);

    // Display Config
    const [pedestalPosition, setPedestalPosition] = useState([0, -50, 0]);

    useEffect(() => {
        if(fieldElementSize[1]) setPedestalPosition([
            pedestalPosition[0], 
            masterBasePosition[1] - pedestalSize[1]*0.55 - fieldElementSize[1]/2, 
            pedestalPosition[2]
        ]);
    }, [fieldElementSize]);

    const aProps = useSpring({
        pPosition: pedestalPosition,
        pSize: pedestalSize,
        onRest: () => {
            if(isMounted.current) {
                setStackOpacity(1);
            } else {
                isMounted.current = true;
            }
        }
    });

    return (
        <a.mesh
          position={aProps.pPosition}
          scale={aProps.pSize}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]}>
                <bufferAttribute 
                    attachObject={['attributes', 'alphaValue']}
                    array={alphaArray}
                    itemSize={1}
                />
            </boxBufferGeometry>

            <shaderMaterial
                attach="material"
                side={THREE.DoubleSide}
                transparent={true}
                depthTest={false}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}/>
        </a.mesh>
        
    )
}

export default Pedestal;