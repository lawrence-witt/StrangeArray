export const getFieldData = (fieldDim, position, size, padPerc) => {

    let cubeUnitLength = size/fieldDim;
    let cubeUnitSize = new Array(3).fill(cubeUnitLength);

    let constructors = getConstructors(size, fieldDim, cubeUnitLength);
    let rawFieldPositions = apply2DConstructors(position.slice(), constructors);
    
    // Apply 'padding' to each cube on the field
    let fieldElementSize = cubeUnitSize.map(side => side - side*padPerc);

    return {rawFieldPositions, fieldElementSize}
}

export const getCubeData = (array, position, size, padPerc) => {

    let cubeLength = size[0]; // the computed length of one side of the CubeGroup
    let cubeDim = Math.ceil(Math.cbrt(array.length)); // the overall unit dimension of the CubeGroup (e.g 2 for 2x2x2, 3 for 3x3x3)

    let cubeUnitLength = cubeLength/cubeDim; // the length of one side of a unit
    let cubeUnitSize = new Array(3).fill(cubeUnitLength); // the size of each unit inside the cube

    // Calculate the position of each possible Cube within the CubeGroup
    let constructors = getConstructors(cubeLength, cubeDim, cubeUnitLength);
    let newPositions = apply3DConstructors(position, constructors);
    let defaultPositions = newPositions.slice().sort((a, b) => a[1] - b[1]);

    // Positions of the cubes adjusted for next layer
    let raisedPositions = defaultPositions.map(position => [position[0], position[1]+cubeLength, position[2]]);

    // Apply 'padding' to the elements in each cube
    let cubeElementSize = cubeUnitSize.map(side => side - side*padPerc);

    return {defaultPositions, raisedPositions, cubeElementSize}
}

export const compensateFieldPositions = (fieldPositions, position, size, fieldElementSize, parentFieldOffset, layerPadPerc) => {
    const newFieldOffset = [
        position[0]+parentFieldOffset[0], 
        position[1]+parentFieldOffset[1], 
        position[2]+parentFieldOffset[2]
    ];
    const newBaseOffset = position[1]+fieldElementSize[1]/2+size[1]/2+layerPadPerc;
    const trueFieldPositions = fieldPositions.map(fPosition => {
        return [
            fPosition[0]-newFieldOffset[0], 
            fPosition[1]+newBaseOffset, 
            fPosition[2]-newFieldOffset[2]
        ];
    });

    return { trueFieldPositions, newFieldOffset };
}

// Returns an array of zeroed vertices which denote the center points
// of any child elements contained within a CubeGroup
// Example: (4, 2, 2) returns [-1, 1] 
function getConstructors(cubeLength, cubeDim, cubeUnitLength) {
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

// Returns an array of all new positions relative to the base position on two axes.
// Example: ([1, 1, 1], [-1, 1]) returns an array of 4 elements ranging from
// [0, 1, 0] to [2, 1, 2]
function apply2DConstructors(position, constructors) {
    let newPositions = [];
    let [ posMemo ] = position.splice(1, 1);
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
    
    return newPositions.map(position => {
        return [position[0], posMemo, position[1]]
    });
}

// Returns an array of all new positions relative to the base position on three axes.
// Example: ([1, 1, 1], [-1, 1]) returns an array of 8 elements ranging from
// [0, 0, 0] to [2, 2, 2]
function apply3DConstructors(position, constructors) {
    let newPositions = [];
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
    
    return newPositions;
}