const bigCanvas = document.getElementById("moon");
const bigCtx = bigCanvas.getContext("2d");
const cameraCanvas = document.getElementById("cameraCanvas");
const cameraCtx = cameraCanvas.getContext("2d");

const bigCanvasWidth = bigCanvas.width;
const bigCanvasHeight = bigCanvas.height;
const cameraCanvasWidth = cameraCanvas.width;
const cameraCanvasHeight = cameraCanvas.height;

// Off-screen canvas for the moon background
const backgroundCanvas = document.createElement("canvas");
backgroundCanvas.width = bigCanvasWidth;
backgroundCanvas.height = bigCanvasHeight;
const backgroundCtx = backgroundCanvas.getContext("2d");

const walls = [];

// Player Properties
let player = {
    x: bigCanvasWidth / 2,
    y: bigCanvasHeight / 2,
    width: 20,
    height: 20,
    speed: 2
};

let defaultEnemy = {
    x: 0,
    y: 0,
    width: 20, // Assuming enemySize is 20
    height: 20,
    speed: 3, // Adjust this value to control the speed
    path: [],
    currentStep: 0,
    nextMoveTime: 0,
    lastPathUpdateTime: 0, // Add this property to track the last path update time
};

// Add walls

function addWall(x, y, width, height) {
    walls.push({ x, y, width, height });
}

function drawWalls() {
    bigCtx.fillStyle = "gray";
    for (const wall of walls) {
        bigCtx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
}

addWall(100, 100, 50, 50);
addWall(200, 200, 100, 20);

// Enemy and player spawning

function spawnEnemy() {
    // Create a new enemy object based on the defaultEnemy template
    let newEnemy = {
        ...defaultEnemy,
        x: 0,
        y: 0,
        path: [],
        currentStep: 0,
        nextMoveTime: 0,
        lastPathUpdateTime: 0
    };

    // Ensure the enemy spawns outside the camera view
    do {
        newEnemy.x = Math.random() * bigCanvasWidth;
        newEnemy.y = Math.random() * bigCanvasHeight;
    } while (isInView(newEnemy.x, newEnemy.y));

    enemies.push(newEnemy);
}

// Draw the player
function drawPlayer() {
    bigCtx.fillStyle = "blue";
    bigCtx.fillRect(player.x, player.y, player.width, player.height);
}

// Handle player movement
let keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function handleMovement() {
    if (keys[controls.move_up]) {
        player.y -= player.speed;
    }
    if (keys[controls.move_down]) {
        player.y += player.speed;
    }
    if (keys[controls.move_left]) {
        player.x -= player.speed;
    }
    if (keys[controls.move_right]) {
        player.x += player.speed;
    }

    // Keep player within the bounds of the big canvas
    player.x = Math.max(0, Math.min(bigCanvasWidth - player.width, player.x));
    player.y = Math.max(0, Math.min(bigCanvasHeight - player.height, player.y));

    requestAnimationFrame(handleMovement);
}

// Start the movement loop
requestAnimationFrame(handleMovement);
handleMovement();