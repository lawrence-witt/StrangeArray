export const getBaseFieldData = (fieldDim, masterBasePosition, baseFieldSize, unitPadPerc) => {
    // The size of each unit on the field
    let cubeUnitSize = new Array(3).fill(baseFieldSize/fieldDim);

    // Calculate the position of each possible Cube on a 2D plane
    let constructors = getConstructors(baseFieldSize, fieldDim);
    let fieldPositions = applyConstructors(masterBasePosition.slice(), constructors, true);

    // Apply 'padding' to each cube on the field
    let fieldElementSize = cubeUnitSize.map(side => side - side*unitPadPerc);

    return {fieldPositions, fieldElementSize};
}

export const getFieldData = (fieldDim, masterBasePosition, baseFieldSize, unitPadPerc, position, size, parentFieldOffset, layerPadPerc) => {
    // The size of each unit on the field
    let cubeUnitSize = new Array(3).fill(baseFieldSize/fieldDim);

    // Calculate the position of each possible Cube on a 2D plane
    let constructors = getConstructors(baseFieldSize, fieldDim);
    let rawFieldPositions = applyConstructors(masterBasePosition, constructors, true);
    
    // Apply 'padding' to each cube on the field
    let fieldElementSize = cubeUnitSize.map(side => side - side*unitPadPerc);

    // Compensate the positions based on the field's height in the stack
    const {trueFieldPositions, newFieldOffset, newBaseOffset} = compensateFieldPositions(rawFieldPositions, position, size, fieldElementSize, parentFieldOffset, layerPadPerc);

    return {fieldPositions: trueFieldPositions, fieldElementSize, newFieldOffset, newBaseOffset};
}

export const getCubeData = (array, position, size, padPerc) => {
    // The length of one side of the CubeGroup
    let cubeLength = size[0];

    // Dimensions of the CubeGroup expressed as single number (e.g. 2 for 2x2x2)
    let cubeDim = Math.ceil(Math.cbrt(array.length));

    // The size of each unit inside the cube
    let cubeUnitSize = new Array(3).fill(cubeLength/cubeDim); 

    // Calculate the position of each possible Cube within the CubeGroup
    let constructors = getConstructors(cubeLength, cubeDim);
    let newPositions = applyConstructors(position, constructors, false)
    let defaultPositions = newPositions.slice().sort((a, b) => a[1] - b[1]);

    // Positions of the cubes adjusted for next layer
    let raisedPositions = defaultPositions.map(position => [position[0], position[1]+cubeLength, position[2]]);

    // Apply 'padding' to the elements in each cube
    let cubeElementSize = cubeUnitSize.map(side => side - side*padPerc);

    return {defaultPositions, raisedPositions, cubeElementSize}
}

function compensateFieldPositions(fieldPositions, position, size, fieldElementSize, parentFieldOffset, layerPadPerc) {
    const newFieldOffset = position.map((pos, i) => pos+parentFieldOffset[i]);
    const newBaseOffset = position[1]+fieldElementSize[1]/2+size[1]/2+layerPadPerc;
    const trueFieldPositions = fieldPositions.map(fPosition => {
        return [
            fPosition[0]-newFieldOffset[0], 
            fPosition[1]+newBaseOffset, 
            fPosition[2]-newFieldOffset[2]
        ];
    });

    return {trueFieldPositions, newFieldOffset, newBaseOffset};
}

// Returns an array of zeroed vertices which denote the center points
// of any child elements contained within a CubeGroup
// Example: (6, 2) returns [-2, 0, 2] 
export function getConstructors(cubeLength, cubeDim) {
    const cubeUnitLength = cubeLength/cubeDim;
    let containers = [];
    for (let i=0; i<=cubeDim; i++) {
        containers.push(cubeUnitLength*i);
    }
    let mids = [];
    containers.reduce((acc, curr) => {
        mids.push((acc+curr)/2);
        return curr;
    })
    return mids.map(point => point -= cubeLength/2);
}

// Returns an array of all new positions relative to the base position, on either 2 or 3 axes.
// 2D Example: ([1, 1, 1], [-1, 1], true) returns an array of 4 elements ranging from
// [0, 1, 0] to [2, 1, 2]
// 3D Example: ([1, 1, 1], [-1, 1], false) returns an array of 8 elements ranging from
// [0, 0, 0] to [2, 2, 2]
export function applyConstructors(position, constructors, twoDims) {
    position = position.slice();
    constructors = constructors.slice();

    let newPositions = [];
    let [ posMemo ] = position.slice(1, 2);
    if(twoDims) position.splice(1, 1);
    const fn = (array, posIdx) => {
        let iteration = [];
        constructors.forEach(constructor => {
            array.forEach(perm => {
                iteration.push([...perm, position[posIdx]+constructor]);
            })
        });
        if (posIdx === position.length-1) {
            newPositions = iteration
        } else {
            fn(iteration, posIdx+1)
        }
    };
    fn([[]], 0);
    
    if(twoDims) {
        return newPositions.map(position => {
            return [position[0], posMemo, position[1]]
        });
    } else {
        return newPositions;
    }   
}