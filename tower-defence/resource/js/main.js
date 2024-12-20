document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById('gameGrid')) {
        initializeGrid();
    }
});

function initializeGrid() {
    const gridContainer = document.getElementById('gameGrid');
    const itemSize = Math.min(gridContainer.clientWidth / columns, gridContainer.clientHeight / rows);

    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = `repeat(${columns}, ${itemSize}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, ${itemSize}px)`;
    gridContainer.style.gap = '1px';

    const totalItems = columns * rows;
    for (let i = 0; i < totalItems; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('tile');
        gridItem.dataset.x = i % columns;
        gridItem.dataset.y = Math.floor(i / columns);
        gridContainer.appendChild(gridItem);
    }
} 
