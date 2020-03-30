export function initialiseGroupWeights(grid){
    const weightedRow = new Array(grid[0].length).fill(1);
    const weightFuncs = [
        (grid) => grid[grid.length-1][grid[0].length-1] = 1, //nw
        (grid, weightedRow) => grid[grid.length-1] = weightedRow, //n
        (grid) => grid[grid.length-1][0] = 1, //ne
        (grid) => grid.forEach(row => row[row.length-1] = 1), //w
        (grid) => grid.forEach(row => row[0] = 1), //e
        (grid) => grid[0][grid[0].length-1] = 1, //sw
        (grid, weightedRow) => grid[0] = weightedRow, //s
        (grid) => grid[0][0] = 1 //se
    ];
    const initialisedGrids = weightFuncs.map(func => {
        const clone = grid.map(row => row.slice(0));
        func(clone, weightedRow);
        return clone;
    });

    return initialisedGrids.map(pillarGrid => distributeGroupWeight(pillarGrid));
};

function distributeGroupWeight(pillarGrid) {
    const groupDim = pillarGrid.length;
    const step = 1/groupDim;

    const initialNodes = pillarGrid.reduce((array, row, i) => {
        row.forEach((col, j) => {
            if(col) array.push({value: col, row: i, col: j});
        });
        return array;
    }, []);

    function weightNodes(activeNodes, grid) {
        const nextNodes = [];
        activeNodes.forEach((node, i) => {
            const n = node.row === 0 ? null : [node.row-1, node.col];
            const w = node.col === 0 ? null : [node.row, node.col-1];
            const e = node.col === groupDim-1 ? null : [node.row, node.col+1];
            const s = node.row === groupDim-1 ? null : [node.row + 1, node.col];
            const nw = n && w ? [node.row-1, node.col-1] : null;
            const ne = n && e ? [node.row-1, node.col+1] : null;
            const sw = s && w ? [node.row+1, node.col-1] : null;
            const se = s && e ? [node.row+1, node.col+1] : null;
            [n, nw, ne, w, e, sw, s, se].forEach(dir => {
                if(dir && grid[dir[0]][dir[1]] === null) {
                    grid[dir[0]][dir[1]] = node.value - step;
                    nextNodes.push({value: node.value - step, row: dir[0], col: dir[1]});
                }
            });
        });
        return nextNodes.length !== 0 ? weightNodes(nextNodes, grid) : grid;
    }

    return weightNodes(initialNodes, pillarGrid);
};

export function getBoxVertices(smallest){
    const vertNoise = Math.random()*0.15;
    const arrayRan = Math.floor(Math.random()*3)
    const topPoint = 0.5 + vertNoise;
    const bottomPoint = smallest ? -0.5 : 0.5 - vertNoise;
    const midPoint = smallest ? 0 + vertNoise/2 : 0.5;
    const pointArray = arrayRan === 0 
    ? [midPoint, topPoint, bottomPoint, midPoint]
    : arrayRan === 1
    ? [midPoint, midPoint, bottomPoint, bottomPoint]
    : [midPoint, midPoint, topPoint, topPoint];

    return [
        [-0.5, -0.5, -0.5], 
        [ 0.5, -0.5, -0.5], 
        [-0.5, -0.5,  0.5], 
        [ 0.5, -0.5,  0.5], 
        [-0.5,  pointArray[0], -0.5], //top nw
        [ 0.5,  pointArray[1], -0.5], //top ne
        [-0.5,  pointArray[2],  0.5], //top sw
        [ 0.5,  pointArray[3],  0.5], //top se
    ] 
};

export const boxFaces = [
    [4, 0, 2], [6, 4, 2], //Left
    [0, 4, 5], [1, 0, 5], //Back
    [3, 1, 5], [5, 7, 3], //Right
    [2, 3, 6], [3, 7, 6], //Front
    [2, 0, 3], [0, 1, 3], //Bottom
    [5, 4, 6], [6, 7, 5]  //Top
]