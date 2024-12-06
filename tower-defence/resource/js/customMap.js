document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById('gameGrid')) {
        loadCustomMapFromStorage();
    }
});

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
            tile.classList.add('path');
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
            console.log(`Water at (${coord.x}, ${coord.y})`);
        } else {
            console.warn(`Invalid water coordinate: (${coord.x}, ${coord.y})`);
        }
    });
}

function resetPath() {
    const gridContainer = document.getElementById('gameGrid');
    Array.from(gridContainer.children).forEach(tile => {
        tile.classList.remove('path', 'crossroad', 'water');
    });
}