import React, { useRef, useState, useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useFrame, useThree, extend } from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';

extend({ OrbitControls });

export default function Controls({focusPoint}) {
    const { camera, gl } = useThree();
    const isMounted = useRef(false);
    const orbitRef = useRef();

    const [positionY, setPositionY] = useState({
        active: false,
        curr: 0,
        next: 0
    })

    useEffect(() => {
        if(isMounted.current) {
            setPositionY({active: true, curr: camera.position.y, next: focusPoint});
        } else {
            isMounted.current = true;
        };
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
        } else if(camera.position.y < -4) {
            camera.position.y = -4;
        }
        
        orbitRef.current.update()
    })
  
    return (
        <orbitControls 
          args={[camera, gl.domElement]}
          ref={orbitRef}
          enableDamping
          minDistance={2}
          maxDistance={40}
          enablePan={false}
        />
    )
}