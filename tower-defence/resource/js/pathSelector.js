document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById('gameGrid')) {
        enablePathSelection();
    }
});

let selectedPath = [];

function enablePathSelection() {
    const gridContainer = document.getElementById('gameGrid');
    gridContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('tile')) {
            const tile = event.target;
            const index = Array.prototype.indexOf.call(gridContainer.children, tile);
            const columns = 20; // Assuming 20 columns as in the initializeGrid function
            const x = index % columns;
            const y = Math.floor(index / columns);

            const lastSelected = selectedPath[selectedPath.length - 1];
            const secondLastSelected = selectedPath[selectedPath.length - 2];

            if (lastSelected && lastSelected.x === x && lastSelected.y === y) {
                selectedPath.pop();
                tile.classList.remove('selected-path', 'crossroad');
            } else if (isAdjacent(lastSelected, { x, y }) && !isSameTile(secondLastSelected, { x, y })) {
                if (isTileInPath({ x, y })) {
                    tile.classList.add('crossroad');
                } else {
                    tile.classList.add('selected-path');
                }
                selectedPath.push({ x, y });
            }
        }
    });
}

function isAdjacent(tile1, tile2) {
    if (!tile1) return true;
    const dx = Math.abs(tile1.x - tile2.x);
    const dy = Math.abs(tile1.y - tile2.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

function isSameTile(tile1, tile2) {
    return tile1 && tile1.x === tile2.x && tile1.y === tile2.y;
}

function isTileInPath(tile) {
    return selectedPath.some(pathTile => pathTile.x === tile.x && pathTile.y === tile.y);
}

function getSelectedPath() {
    return selectedPath;
}

function setSelectedPath(path) {
    selectedPath = path;
}