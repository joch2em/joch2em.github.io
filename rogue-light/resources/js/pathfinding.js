// pathfinding.js
function bfsPathfinding(startX, startY, endX, endY, level) {
    const queue = [{ x: startX, y: startY, path: [] }];
    const visited = new Set();
    visited.add(`${startX},${startY}`);

    while (queue.length > 0) {
        const { x, y, path } = queue.shift();

        if (Math.floor(x) === endX && Math.floor(y) === endY) {
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

    if (level[Math.floor(y) - 1] && level[Math.floor(y) - 1][Math.floor(x)] === 0) neighbors.push({ x, y: y - 1 });
    if (level[Math.floor(y) + 1] && level[Math.floor(y) + 1][Math.floor(x)] === 0) neighbors.push({ x, y: y + 1 });
    if (level[Math.floor(y)][Math.floor(x) - 1] === 0) neighbors.push({ x: x - 1, y });
    if (level[Math.floor(y)][Math.floor(x) + 1] === 0) neighbors.push({ x: x + 1, y });

    // Add diagonal neighbors only if both adjacent tiles are walkable
    // if (level[Math.floor(y) - 1] && level[Math.floor(y) - 1][Math.floor(x) - 1] === 0 && level[Math.floor(y) - 1][Math.floor(x)] === 0 && level[Math.floor(y)][Math.floor(x) - 1] === 0) neighbors.push({ x: x - 1, y: y - 1 });
    // if (level[Math.floor(y) - 1] && level[Math.floor(y) - 1][Math.floor(x) + 1] === 0 && level[Math.floor(y) - 1][Math.floor(x)] === 0 && level[Math.floor(y)][Math.floor(x) + 1] === 0) neighbors.push({ x: x + 1, y: y - 1 });
    // if (level[Math.floor(y) + 1] && level[Math.floor(y) + 1][Math.floor(x) - 1] === 0 && level[Math.floor(y) + 1][Math.floor(x)] === 0 && level[Math.floor(y)][Math.floor(x) - 1] === 0) neighbors.push({ x: x - 1, y: y + 1 });
    // if (level[Math.floor(y) + 1] && level[Math.floor(y) + 1][Math.floor(x) + 1] === 0 && level[Math.floor(y) + 1][Math.floor(x)] === 0 && level[Math.floor(y)][Math.floor(x) + 1] === 0) neighbors.push({ x: x + 1, y: y + 1 });

    return neighbors;
}

function isPathClear(x1, y1, x2, y2, level) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        if (level[y1][x1] !== 0) return false;
        if (x1 === x2 && y1 === y2) break;
        const e2 = err * 2;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
    }
    return true;
}

// function smoothPath(path, level) {
//     if (path.length < 3) return path;
//     const smoothedPath = [path[0]];
//     let lastPoint = path[0];
//     for (let i = 1; i < path.length; i++) {
//         if (!isPathClear(lastPoint.x, lastPoint.y, path[i].x, path[i].y, level)) {
//             smoothedPath.push(path[i - 1]);
//             lastPoint = path[i - 1];
//         }
//     }
//     smoothedPath.push(path[path.length - 1]);
//     return smoothedPath;
// }

// export { bfsPathfinding, smoothPath, isPathClear };
export { bfsPathfinding, isPathClear };