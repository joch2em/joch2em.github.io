document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById('gameGrid')) {
        initializeTileInteractions();
    }
});

function initializeTileInteractions() {
    const gridContainer = document.getElementById('gameGrid');
    Array.from(gridContainer.children).forEach(tile => {
        tile.addEventListener('click', handleTileClick);
    });
}

function handleTileClick(event) {
    const tile = event.target.closest('.tile');
    if (tile.querySelector('div')) {
        // Tile already has a tower
        console.log('Tile already has a tower');
    } else if (tile.classList.contains('water')) {
        // Handle water tile click
        console.log('Water tile clicked');
    } else if (tile.classList.contains('path')) {
        // Handle path tile click
        console.log('Path tile clicked');
    } else {
        // Handle other tile click
        console.log('Other tile clicked');
        showTowerMenu(tile);
    }
}

function showTowerMenu(tile) {
    const menu = document.getElementById('towerMenu');
    menu.style.display = 'flex';

    menu.addEventListener('mouseleave', () => {
        menu.style.display = 'none';
    });

    const rect = tile.getBoundingClientRect();
    menu.style.left = `${rect.left + window.scrollX}px`;
    menu.style.top = `${rect.top + window.scrollY}px`;

    menu.querySelectorAll('.tower-option').forEach(button => {
        const newButton = button.cloneNode(true);
        button.replaceWith(newButton);
        newButton.addEventListener('click', () => {
            placeTower(tile, newButton.value);
            menu.style.display = 'none';
        });
    });
}

function placeTower(tile, towerType) {
    const x = tile.dataset.x;
    const y = tile.dataset.y;
    const tower = makeTower(x, y, towerType);
    if (tower) {
        towers.push(tower);
        const towerDiv = document.createElement('div');
        towerDiv.classList.add(towerType);
        tile.appendChild(towerDiv);
        tile.dataset.towerType = towerType;
        console.log(`Placed ${towerType} on tile at (${x}, ${y})`);
    } else {
        console.error(`Failed to place tower: ${towerType}`);
    }
}