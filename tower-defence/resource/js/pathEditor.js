document.addEventListener('DOMContentLoaded', (event) => {

    const customMapData = localStorage.getItem('TD-customMap');
    if (customMapData) {
        try {
            const map = JSON.parse(customMapData);
            console.log(map);
            resetPath();
            loadPath(map.path);
            loadWater(map.water);
        } catch (error) {
            console.error('Failed to load custom map:', error);
        }
    }

    document.getElementById('savePathButton').addEventListener('click', () => {
        const data = getMap();
        console.log(data);
        localStorage.setItem('TD-customMap', JSON.stringify(data));
    });

    document.getElementById('loadPathButton').addEventListener('click', () => {
        const pathInput = document.getElementById('pathInput').value;
        let data = localStorage.getItem('TD-customData') ?? null;
        if (!data && !pathInput) {
            alert('No data found in local storage or input field.');
            return;
        }
        if (pathInput) {
            try {
                data = JSON.parse(pathInput);
            } catch (e) {
                alert('Invalid JSON in input field.');
                return;
            }
        } else {
            try {
                data = JSON.parse(data);
            }
            catch (e) {
                alert('Invalid JSON in local storage.');
                return;
            }
        }
        resetPath();
        loadPath(data.path);
        loadWater(data.water);
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        resetPath();
    });

    document.getElementById('testPathButton').addEventListener('click', () => {
        testPath();
    });

    document.getElementById('importPathButton').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const map = JSON.parse(e.target.result);
                    resetPath();
                    loadPath(map.path);
                    loadWater(map.water);
                } catch (error) {
                    alert('Invalid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    });

    document.getElementById('downloadPathButton').addEventListener('click', () => {
        const data = getMap();
        console.log(data);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    const toolOverlay = document.getElementById('toolOverlay');
    const openToolOverlayButton = document.getElementById('openToolOverlayButton');
    const closeToolOverlayButton = document.getElementById('closeToolOverlayButton');
    const toolButtons = document.querySelectorAll('.toolButton');
    const selectedToolElement = document.getElementById('selectedTool');

    openToolOverlayButton.addEventListener('click', () => {
        toolOverlay.style.display = 'flex';
    });

    closeToolOverlayButton.addEventListener('click', () => {
        toolOverlay.style.display = 'none';
    });

    toolButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedTool = event.target.getAttribute('data-tool');
            selectTool(selectedTool);
            toolOverlay.style.display = 'none';
        });
    });

    function selectTool(tool) {
        selectedTool = tool;
        selectedToolElement.textContent = tool;
        console.log(`Selected tool: ${tool}`);
    }

    selectTool('Path Painter');
});

function loadPath(path) {
    const gridContainer = document.getElementById('gameGrid');
    selectedPath = path;
    path.forEach(coord => {
        const index = coord.y * 20 + coord.x;
        const tile = gridContainer.children[index];
        tile.classList.add('selected-path');
    });
}

function loadWater(water) {
    const gridContainer = document.getElementById('gameGrid');
    selectedWater = water;
    water.forEach(coord => {
        const index = coord.y * 20 + coord.x;
        const tile = gridContainer.children[index];
        tile.classList.add('water');
    });
}

function resetPath() {
    const gridContainer = document.getElementById('gameGrid');
    selectedPath = [];
    selectedWater = [];
    Array.from(gridContainer.children).forEach(tile => {
        tile.classList.remove('selected-path', 'crossroad', 'water');
    });
}

function testPath() {
    moveSpeed = 2; // Lower is faster
    const path = getSelectedPath();
    if (path.length === 0) {
        alert('No path to test.');
        return;
    }

    const circle = document.createElement('div');
    if (Math.random() > 0.5) {
        circle.dataset.randomOffset = Math.round(Math.random() * 15);
    } else {
        circle.dataset.randomOffset = -Math.round(Math.random() * 15);
    }
    console.log(circle.dataset.randomOffset);
    circle.classList.add('circle');
    circle.style.transition = `all ${moveSpeed}s linear`;
    document.body.appendChild(circle);

    let index = 0;
    let firstCall = true;
    function moveCircle() {
        if (index >= path.length) {
            setTimeout(() => {
                document.body.removeChild(circle);
            }, 500);
            return;
        }
        const coord = path[index];
        const tile = document.getElementById('gameGrid').children[coord.y * 20 + coord.x];
        const rect = tile.getBoundingClientRect();
        circle.style.left = `${(rect.left + window.scrollX + rect.width / 2 - circle.offsetWidth / 2)}px`;
        circle.style.top = `${(rect.top + window.scrollY + rect.height / 2 - circle.offsetHeight / 2) + parseInt(circle.dataset.randomOffset)}px`;
        index++;
        if (firstCall) {
            firstCall = false;
            moveCircle();
            return;
        }
        setTimeout(moveCircle, moveSpeed * 999);
    }
    moveCircle();
}