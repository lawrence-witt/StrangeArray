import React, { useEffect, useState, useMemo } from 'react';
import { useLoader } from 'react-three-fiber';
import * as THREE from 'three';

import Pillar from './Pillar';

import plainMap from '../../assets/textures/plainmap.jpg'
import { getConstructors, applyConstructors } from '../../utils/GeometryCalculator';
import { initialiseGroupWeights } from '../../utils/PillarCalculator';

export default function Pillars({pedestalSize, maxY}) {

    const pillarTexture = useLoader(THREE.TextureLoader, plainMap);
    pillarTexture.wrapS = THREE.RepeatWrapping;
    pillarTexture.wrapT = THREE.RepeatWrapping;
    pillarTexture.repeat.set(1, 15);

    // Position/size of each of the 8 pillar groups in relation to the pededstal
    const pGDim = 4;
    const groupGrid = Array.from({length: pGDim}, e => Array(pGDim).fill(null));
    const pGSize = pedestalSize;
    const pGPositions = useMemo(() => {
        const nextPositions = applyConstructors([0, maxY*1.35, 0], [-pedestalSize[0], 0, pedestalSize[2]], true);
        nextPositions.splice(4, 1);
        return nextPositions;
    }, [maxY]);

    // Max height and position of each pillar in relation to its group
    const pillarSize = [pGSize[0]/pGDim, pGSize[1], pGSize[2]/pGDim];
    const pillarPositions = useMemo(() => {
        return pGPositions.map(pGroup => {
            const groupConstructors = getConstructors(pGSize[0], pGDim);
            return applyConstructors(pGroup, groupConstructors, true);
        }).reduce((a, c) => a.concat(c));
    }, [pGPositions]); 

    // Weight the height of each pillar by distance from the pedestal
    const pillarWeightGroups = useMemo(() => initialiseGroupWeights(groupGrid), []);
    const appliedPillarWeights = useMemo(() => {
        return pillarWeightGroups.map(pillarGroup => {
            return pillarGroup.map(row => row.map((col, j) => {
                const smallest = !row.some(p => p < col) && !pillarGroup.some(row => row[j] < col);
                const noise = col*0.3;
                const deviation = Math.random()*((col - (col-noise))) + col-noise;
                return {
                    scale: [pillarSize[0], pillarSize[1]*deviation, pillarSize[2]],
                    smallest,
                    factor: deviation
                };
            })).reduce((a, c) => a.concat(c));
        }).reduce((a, c) => a.concat(c));
    }, []);

    // Set and update the current pillar state
    const [pillarState, setPillarState] = useState({
        positions: pillarPositions,
        weights: appliedPillarWeights
    });

    const {positions, weights} = pillarState;

    useEffect(() => {
        if(maxY) {
            setPillarState({
                ...pillarState,
                positions: pillarPositions
            });
        }
    }, [maxY]);

    return positions.map((pillar, i) => {
        return (
            <Pillar 
                key={i}
                position={[
                    pillar[0], 
                    pillar[1]*1.5 + ((weights[i].scale[1])/2), 
                    pillar[2]
                ]} 
                scale={weights[i].scale}
                smallest={weights[i].smallest}
                texture={pillarTexture}/>
        );
    });
}