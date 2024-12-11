document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById('gameGrid')) {
        carvePath();
        document.getElementById('startEnemies').addEventListener('click', startSpawningEnemies);
    }
});

const pathCoordinates = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, /* ...more coordinates... */
];

function carvePath() {
    const gridContainer = document.getElementById('gameGrid');
    pathCoordinates.forEach(coord => {
        const index = coord.y * 20 + coord.x;
        const tile = gridContainer.children[index];
        tile.classList.add('path');
    });
}

function startSpawningEnemies() {
    console.log('Starting to spawn enemies...');
    spawnEnemy(pathCoordinates);
    //  W.I.P.
}
