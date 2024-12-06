document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById('gameGrid')) {
        carvePath();
    }
});

function carvePath() {
    const pathCoordinates = [

    ];

    const gridContainer = document.getElementById('gameGrid');
    pathCoordinates.forEach(coord => {
        const index = coord.y * 20 + coord.x;
        const tile = gridContainer.children[index];
        tile.classList.add('path');
    });
}
