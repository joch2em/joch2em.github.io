const weapons = {
    pistol: {
        damage: 10,
        fireRate: 600,      // the bigger the slower
        reloadTime: 2000,   // the bigger the slower
        magazineSize: 12,
        projectiles: 1,
        spread: 0,          // the bigger the more spread
    },
    shotgun: {
        damage: 50,
        fireRate: 1200,     // the bigger the slower
        reloadTime: 4000,   // the bigger the slower
        magazineSize: 6,
        projectiles: 8,
        spread: 40,          // the bigger the more spread
    },
    machineGun: {
        damage: 5,
        fireRate: 100,      // the bigger the slower
        reloadTime: 3000,   // the bigger the slower
        magazineSize: 30,
        projectiles: 1,
        spread: 10,          // the bigger the more spread
    }
}

let equippedWeapon = weapons.pistol;
let currentAmmo = equippedWeapon.magazineSize;
ammo.innerHTML = "Ammo: " + currentAmmo;

// new code

const enemies = [];
const enemySize = 20;
const spawnEnemyButton = document.getElementById("spawnEnemyButton");

spawnEnemyButton.addEventListener("click", spawnEnemy);

function isInView(x, y) {
    let cameraX = player.x - cameraCanvasWidth / 2;
    let cameraY = player.y - cameraCanvasHeight / 2;
    return x > cameraX && x < cameraX + cameraCanvasWidth && y > cameraY && y < cameraCanvasHeight;
}

function drawEnemies() {
    bigCtx.fillStyle = "red";
    for (const enemy of enemies) {
        bigCtx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

function createGrid(excludeEnemy = null) {
    const grid = [];
    for (let y = 0; y < bigCanvasHeight / enemySize; y++) {
        const row = [];
        for (let x = 0; x < bigCanvasWidth / enemySize; x++) {
            row.push(0); // 0 means walkable
        }
        grid.push(row);
    }

    // Mark walls as non-walkable
    for (const wall of walls) {
        const startX = Math.floor(wall.x / enemySize);
        const startY = Math.floor(wall.y / enemySize);
        const endX = Math.floor((wall.x + wall.width) / enemySize);
        const endY = Math.floor((wall.y + wall.height) / enemySize);

        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                grid[y][x] = 1; // 1 means non-walkable
            }
        }
    }

    // Mark enemy positions as non-walkable, excluding the current enemy
    for (const enemy of enemies) {
        if (enemy !== excludeEnemy) {
            const enemyX = Math.floor(enemy.x / enemySize);
            const enemyY = Math.floor(enemy.y / enemySize);
            grid[enemyY][enemyX] = 1; // 1 means non-walkable
        }
    }

    return grid;
}

function moveEnemies() {
    const pathUpdateInterval = 1000; // Update path every second

    for (const enemy of enemies) {
        const currentTime = Date.now();

        // Update the path if the interval has passed or if the path is empty
        if (!enemy.path || enemy.path.length === 0 || currentTime - enemy.lastPathUpdateTime > pathUpdateInterval) {
            const startNode = new Node(Math.floor(enemy.x / enemySize), Math.floor(enemy.y / enemySize));
            const goalNode = new Node(Math.floor(player.x / enemySize), Math.floor(player.y / enemySize));
            enemy.path = aStarPathfinding(startNode, goalNode, createGrid(enemy));
            enemy.currentStep = 0;
            enemy.lastPathUpdateTime = currentTime; // Update the last path update time
        }

        if (enemy.path.length > 0) {
            if (!enemy.nextMoveTime || currentTime >= enemy.nextMoveTime) {
                const nextStep = enemy.path[enemy.currentStep];
                const targetX = nextStep.x * enemySize;
                const targetY = nextStep.y * enemySize;

                const dx = targetX - enemy.x;
                const dy = targetY - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > enemy.speed) {
                    enemy.x += (dx / distance) * enemy.speed;
                    enemy.y += (dy / distance) * enemy.speed;
                } else {
                    enemy.x = targetX;
                    enemy.y = targetY;
                    enemy.currentStep++;
                    if (enemy.currentStep >= enemy.path.length) {
                        enemy.path = [];
                    }
                }

                enemy.nextMoveTime = currentTime + (1000 / 60); // Update every frame (60 FPS)
            }
        }

        // Check if the enemy has reached the player
        const playerDistance = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);
        if (playerDistance < enemySize) {
            // Handle enemy reaching the player (e.g., stop movement, attack, etc.)
            continue; // Skip further movement for this enemy
        }

        // Check for collisions with other enemies
        for (const otherEnemy of enemies) {
            if (enemy !== otherEnemy) {
                const dx = otherEnemy.x - enemy.x;
                const dy = otherEnemy.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < enemySize) {
                    // Move the enemy away from the other enemy
                    const angle = Math.atan2(dy, dx);
                    enemy.x -= Math.cos(angle) * enemy.speed;
                    enemy.y -= Math.sin(angle) * enemy.speed;
                }
            }
        }
    }
}


// Draw the moon-like background ONCE on the off-screen canvas
function drawMoonBackground() {
    // Moon color
    backgroundCtx.fillStyle = "#ddd";
    backgroundCtx.fillRect(0, 0, bigCanvasWidth, bigCanvasHeight);

    // Draw craters
    backgroundCtx.fillStyle = "#aaa";
    for (let i = 0; i < 50; i++) {
        let radius = Math.random() * 50 + 10;
        let x = Math.random() * bigCanvasWidth;
        let y = Math.random() * bigCanvasHeight;
        backgroundCtx.beginPath();
        backgroundCtx.arc(x, y, radius, 0, Math.PI * 2);
        backgroundCtx.fill();
    }
}

// Update the camera view
function updateCamera() {
    // Clear the camera canvas
    cameraCtx.clearRect(0, 0, cameraCanvasWidth, cameraCanvasHeight);

    // Calculate the camera's position
    let cameraX = player.x - cameraCanvasWidth / 2;
    let cameraY = player.y - cameraCanvasHeight / 2;

    // Keep camera within bounds
    cameraX = Math.max(0, Math.min(bigCanvasWidth - cameraCanvasWidth, cameraX));
    cameraY = Math.max(0, Math.min(bigCanvasHeight - cameraCanvasHeight, cameraY));

    // Draw the portion of the big canvas onto the camera canvas
    cameraCtx.drawImage(
        bigCanvas,
        cameraX, cameraY, cameraCanvasWidth, cameraCanvasHeight,
        0, 0, cameraCanvasWidth, cameraCanvasHeight
    );
}

// Main loop
function loop() {
    // Draw the static background from the off-screen canvas onto the big canvas
    bigCtx.clearRect(0, 0, bigCanvasWidth, bigCanvasHeight);
    bigCtx.drawImage(backgroundCanvas, 0, 0);

    // Draw the walls
    drawWalls();

    // Draw the player on top of the background
    drawPlayer();

    // Draw the enemies
    drawEnemies();

    // Move the enemies
    moveEnemies();

    // Update the camera view to follow the player
    updateCamera();

    // Request the next frame
    requestAnimationFrame(loop);
}

// Initialize
drawMoonBackground(); // Draw the moon background once on the off-screen canvas
loop();