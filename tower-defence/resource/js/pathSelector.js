document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById('gameGrid')) {
        enablePathSelection();
    }
});

function enablePathSelection() {
    const gridContainer = document.getElementById('gameGrid');
    gridContainer.addEventListener('mousedown', (event) => {
        if (event.target.classList.contains('tile')) {
            isDragging = true;
            isFirstTile = true;
            handleTileSelection(event.target);
            lastTile = event.target;
        }
    });

    gridContainer.addEventListener('mousemove', (event) => {
        if (isDragging && event.target.classList.contains('tile') && event.target !== lastTile) {
            if (isFirstTile) {
                isFirstTile = false;
                return;
            }
            handleTileSelection(event.target);
            lastTile = event.target;
        }
    });

    gridContainer.addEventListener('mouseup', () => {
        isDragging = false;
        lastTile = null;
        isFirstTile = true;
    });

    gridContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        lastTile = null;
        isFirstTile = true;
    });
}

function handleTileSelection(tile) {
    const gridContainer = document.getElementById('gameGrid');
    const index = Array.prototype.indexOf.call(gridContainer.children, tile);
    const columns = 20;
    const x = index % columns;
    const y = Math.floor(index / columns);

    switch (selectedTool) {
        case 'Path Painter':
            handlePathPainter(tile, x, y);
            break;
        case 'Water Painter':
            handleWaterPainter(tile, x, y);
            break;
    }
}

function handlePathPainter(tile, x, y) {
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
        selectedWater = selectedWater.filter(waterTile => !(waterTile.x === x && waterTile.y === y));
        tile.classList.remove('water');
    }
}

function handleWaterPainter(tile, x, y) {
    tile.classList.toggle('water');
    if (tile.classList.contains('water')) {
        selectedWater.push({ x, y });
        selectedPath = selectedPath.filter(pathTile => !(pathTile.x === x && pathTile.y === y));
        tile.classList.remove('selected-path', 'crossroad');
    } else {
        selectedWater = selectedWater.filter(waterTile => !(waterTile.x === x && waterTile.y === y));
    }
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

function getSelectedWater() {
    return selectedWater;
}

function getMap() {
    return {
        path: getSelectedPath(),
        water: getSelectedWater()
    };
}

function setSelectedPath(path) {
    selectedPath = path;
}

function setSelectedWater(water) {
    selectedWater = water;
}