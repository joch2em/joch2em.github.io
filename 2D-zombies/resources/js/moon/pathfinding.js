class Node {
    constructor(x, y, parent = null) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.g = 0; // Cost from start to this node
        this.h = 0; // Heuristic cost from this node to the goal
        this.f = 0; // Total cost (g + h)
    }
}

function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function aStarPathfinding(start, goal, grid) {
    const openList = [];
    const closedList = [];
    openList.push(start);

    while (openList.length > 0) {
        let lowestIndex = 0;
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < openList[lowestIndex].f) {
                lowestIndex = i;
            }
        }

        const currentNode = openList[lowestIndex];

        if (currentNode.x === goal.x && currentNode.y === goal.y) {
            const path = [];
            let current = currentNode;
            while (current) {
                path.push({ x: current.x, y: current.y });
                current = current.parent;
            }
            return path.reverse();
        }

        openList.splice(lowestIndex, 1);
        closedList.push(currentNode);

        const neighbors = getNeighbors(currentNode, grid, goal);
        for (const neighbor of neighbors) {
            if (closedList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                continue;
            }

            const gScore = currentNode.g + 1;
            let gScoreIsBest = false;

            if (!openList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
                gScoreIsBest = true;
                neighbor.h = heuristic(neighbor, goal);
                openList.push(neighbor);
            } else if (gScore < neighbor.g) {
                gScoreIsBest = true;
            }

            if (gScoreIsBest) {
                neighbor.parent = currentNode;
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
            }
        }
    }

    return []; // No path found
}

function getNeighbors(node, grid, goal) {
    const neighbors = [];
    const directions = [
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 },  // Down
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 },  // Right
        { x: -1, y: -1 }, // Up-Left
        { x: 1, y: -1 },  // Up-Right
        { x: -1, y: 1 },  // Down-Left
        { x: 1, y: 1 },    // Down-Right
    ];

    for (const direction of directions) {
        const newX = node.x + direction.x;
        const newY = node.y + direction.y;

        // Allow the goal node (player's position) to be walkable even if it is marked as non-walkable
        if ((newX === goal.x && newY === goal.y) || (newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length && grid[newY][newX] === 0)) {
            neighbors.push(new Node(newX, newY, node));
        }
    }

    return neighbors;
}