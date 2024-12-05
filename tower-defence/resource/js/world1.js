document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById('gameGrid')) {
        carvePath();
    }
});

function carvePath() {
    const pathCoordinates = [
        { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 1, y: 5 }, { x: 1, y: 6 },
        { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 3, y: 5 }, { x: 3, y: 4 },
        { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
        { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }, { x: 8, y: 3 },
        { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 },
        { x: 7, y: 7 }, { x: 6, y: 7 }, { x: 6, y: 6 }, { x: 6, y: 5 },
        { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 }, { x: 9, y: 4 },
        { x: 9, y: 3 }, { x: 10, y: 3 }, { x: 11, y: 3 }, { x: 12, y: 3 },// continue here! <<<<<<<<<<<<<<<<<<<
        { x: 19, y: 9 }
    ];

    const gridContainer = document.getElementById('gameGrid');
    pathCoordinates.forEach(coord => {
        const index = coord.y * 20 + coord.x;
        const tile = gridContainer.children[index];
        tile.classList.add('path');
    });
}
