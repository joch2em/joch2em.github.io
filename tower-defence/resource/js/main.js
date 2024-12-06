document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById('gameGrid')) {
        initializeGrid();
        loadCustomMapFromStorage();
    }
});

function initializeGrid() {
    const gridContainer = document.getElementById('gameGrid');
    const columns = 20;
    const rows = 10;
    const itemSize = Math.min(gridContainer.clientWidth / columns, gridContainer.clientHeight / rows);

    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = `repeat(${columns}, ${itemSize}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, ${itemSize}px)`;
    gridContainer.style.gap = '1px';

    const totalItems = columns * rows;
    for (let i = 0; i < totalItems; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('tile');
        gridContainer.appendChild(gridItem);
    }
}

function loadCustomMapFromStorage() {
    const customMapData = localStorage.getItem('TD-customMap');
    if (customMapData) {
        try {
            const map = JSON.parse(customMapData);
            resetPath();
            loadPath(map.path);
            loadWater(map.water);
        } catch (error) {
            console.error('Failed to load custom map:', error);
        }
    }
}

function loadPath(path) {
    const gridContainer = document.getElementById('gameGrid');
    const totalItems = gridContainer.children.length;
    path.forEach(coord => {
        const index = coord.y * 20 + coord.x;
        if (index >= 0 && index < totalItems) {
            const tile = gridContainer.children[index];
            tile.classList.add('selected-path');
        } else {
            console.warn(`Invalid path coordinate: (${coord.x}, ${coord.y})`);
        }
    });
}

function loadWater(water) {
    const gridContainer = document.getElementById('gameGrid');
    const totalItems = gridContainer.children.length;
    water.forEach(coord => {
        const index = coord.y * 20 + coord.x;
        if (index >= 0 && index < totalItems) {
            const tile = gridContainer.children[index];
            tile.classList.add('water');
        } else {
            console.warn(`Invalid water coordinate: (${coord.x}, ${coord.y})`);
        }
    });
}

function resetPath() {
    const gridContainer = document.getElementById('gameGrid');
    Array.from(gridContainer.children).forEach(tile => {
        tile.classList.remove('selected-path', 'crossroad', 'water');
    });
}
