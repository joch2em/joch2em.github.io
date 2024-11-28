// pathfinding.js
function bfsPathfinding(startX, startY, endX, endY, level) {
    const queue = [{ x: startX, y: startY, path: [] }];
    const visited = new Set();
    visited.add(`${startX},${startY}`);

    while (queue.length > 0) {
        const { x, y, path } = queue.shift();

        if (x === endX && y === endY) {
            return path.concat({ x, y });
        }

        const neighbors = getNeighbors({ x, y }, level);
        for (const neighbor of neighbors) {
            const key = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(key)) {
                visited.add(key);
                queue.push({ x: neighbor.x, y: neighbor.y, path: path.concat({ x, y }) });
            }
        }
    }

    return []; // No path found
}

function getNeighbors(node, level) {
    const { x, y } = node;
    const neighbors = [];

    if (level[y - 1] && level[y - 1][x] === 0) neighbors.push({ x, y: y - 1 });
    if (level[y + 1] && level[y + 1][x] === 0) neighbors.push({ x, y: y + 1 });
    if (level[y][x - 1] === 0) neighbors.push({ x: x - 1, y });
    if (level[y][x + 1] === 0) neighbors.push({ x: x + 1, y });

    return neighbors;
}

function smoothPath(path) {
    if (path.length < 3) return path;
    const smoothedPath = [path[0]];
    for (let i = 1; i < path.length - 1; i++) {
        const prev = path[i - 1];
        const curr = path[i];
        const next = path[i + 1];
        if ((prev.x === next.x && curr.x === next.x) || (prev.y === next.y && curr.y === next.y)) {
            continue;
        }
        smoothedPath.push(curr);
    }
    smoothedPath.push(path[path.length - 1]);
    return smoothedPath;
}

export { bfsPathfinding, smoothPath };