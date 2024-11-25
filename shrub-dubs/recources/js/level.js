const canvas = document.getElementById('level');
const ctx = canvas.getContext('2d');

const rows = 5;
const cols = 10;
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;

let isPaused = false;
const pauseMenu = document.getElementById('pauseScreen');

const sunTimeout = 15000;

let sunCount = 1000;
let hoveredCell = { row: null, col: null };

let waveIndex = 0;
let startTime = Date.now();

const plantSelectionBar = document.getElementById('plant-selection-bar');

try {
    waves;
    console.log('Using predetermened waves');
}
catch (error) {
    const waveCount = 40; // Number of waves to generate
    const minTime = 10000; // Minimum time for the first wave
    const maxTime = 180000; // Maximum time for the last wave
    const minSpeed = 0.8; // Minimum speed of enemies
    const maxSpeed = 1.2; // Maximum speed of enemies

    waves = Array.from({ length: waveCount }, (_, i) => ({
        time: Math.floor(minTime + (maxTime - minTime) * (i / waveCount)), // Distribute timings evenly
        row: Math.round(Math.random() * (rows - 1)), // Random row with equal probability
        speed: (Math.random() * (maxSpeed - minSpeed) + minSpeed).toFixed(2) // Random speed between minSpeed and maxSpeed
    }));
    console.log('Generated waves', waves);
}

class Projectile {
    constructor(x, y, speed, target, damage) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.target = target;
        this.damage = damage ?? 10; // Damage of the projectile
        this.radius = 5; // Radius of the projectile
    }

    move() {
        this.x += this.speed; // Move the projectile to the right
    }

    draw() {
        ctx.fillStyle = 'black'; // Color of the projectile
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    hasHitTarget() {
        return this.x >= this.target.x; // Check if the projectile has reached the target
    }
}

const projectiles = [];

function shootProjectile(cell, target) {
    const x = cell.col * cellWidth + cellWidth; // Start at the right edge of the cell
    const y = cell.row * cellHeight + cellHeight / 2; // Centered vertically in the cell
    const speed = 6; // Speed of the projectile
    const damage = cell.plant.damage; // Damage of the projectile
    const projectile = new Projectile(x, y, speed, target, damage);
    projectiles.push(projectile);
}

class Enemy {
    constructor(row, speed) {
        this.row = row;
        this.x = canvas.width; // Start outside the canvas on the right
        this.y = row * cellHeight + cellHeight / 2; // Centered vertically in the row
        this.width = 40; // Width of the enemy
        this.height = 40; // Height of the enemy
        this.speed = speed; // Speed of the enemy
        this.health = 100; // Health of the enemy
        this.attacking = false; // Whether the enemy is attacking a plant
    }

    move() {
        if (!this.attacking) {
            this.x -= this.speed; // Move the enemy to the left
        }
    }

    draw() {
        ctx.fillStyle = 'red'; // Color of the enemy
        ctx.fillRect(this.x, this.y - this.height / 2, this.width, this.height); // Draw the enemy

        // Draw the health text
        ctx.fillStyle = 'white'; // Color of the text
        ctx.font = '16px Arial'; // Font of the text
        ctx.textAlign = 'center'; // Center the text
        ctx.fillText(this.health, this.x + this.width / 2, this.y); // Draw the health text
    }

    checkCollisionWithPlant(cell) {
        const plantX = cell.col * cellWidth;
        if (this.row === cell.row && this.x <= plantX + cellWidth) {
            this.attacking = true;
            return true;
        }
        return false;
    }

    drainPlantHealth(cell) {
        if (this.attacking && cell.plant) {
            cell.plant.health -= 1; // Drain the plant's health over time
            if (cell.plant.health <= 0 || !cell.plant) {
                this.attacking = false; // Stop attacking if the plant is removed
                cell.plant = null; // Remove the plant
                this.attacking = false; // Stop attacking
                // Ensure all enemies in the same row resume moving
                enemies.forEach(enemy => {
                    if (enemy.row === this.row && enemy.attacking) {
                        enemy.attacking = false;
                    }
                });
            }
        }
    }
}

const enemies = [];

function spawnEnemy(row = Math.floor(Math.random() * rows), speed = 10) {
    const enemy = new Enemy(row, speed);
    enemies.push(enemy);
}

const adjustLightness = (hsl, shift) => hsl.replace(/(\d+)%\)$/, (m, l) => `${Math.min(100, Math.max(0, +l + shift))}%)`);

availablePlants.forEach(plant => {
    const plantItem = document.createElement('div');
    plantItem.classList.add('plant-item');
    plantItem.textContent = plant.type;
    plantItem.draggable = true;
    plantItem.dataset.type = plant.type;
    plantItem.style.backgroundColor = plant.color;

    const rechargeOverlay = document.createElement('div');
    rechargeOverlay.classList.add('recharge-overlay');
    const rechargeProgress = document.createElement('div');
    rechargeProgress.classList.add('recharge-progress');
    rechargeOverlay.appendChild(rechargeProgress);
    plantItem.appendChild(rechargeOverlay);

    plantSelectionBar.appendChild(plantItem);
});

plantSelectionBar.addEventListener('dragstart', (event) => {
    if (isPaused) { return; }
    const plantType = event.target.dataset.type;
    const plant = availablePlants.find(p => p.type === plantType);

    if (plant.recharging) {
        event.preventDefault();
    } else {
        event.dataTransfer.setData('plantType', plantType);
    }
});

canvas.addEventListener('dragover', (event) => {
    if (isPaused) { return; }
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    if (hoveredCell.row !== row || hoveredCell.col !== col) {
        hoveredCell = { row, col };
        drawGrid();
    }
});

canvas.addEventListener('drop', (event) => {
    if (isPaused) { return; }
    event.preventDefault();
    const plantType = event.dataTransfer.getData('plantType');
    const plant = availablePlants.find(p => p.type === plantType);

    if (plant && sunCount >= plant.cost) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);

        if (!grid[row][col].plant) {
            // Clone the plant to ensure each cell has its own instance
            const newPlant = Object.assign(Object.create(Object.getPrototypeOf(plant)), plant);
            newPlant.lastShotTime = 0; // Initialize lastShotTime for the new plant

            grid[row][col].plant = newPlant;
            sunCount -= plant.cost;
            document.getElementById('sun-counter').textContent = `Sun: ${sunCount}`;
            drawGrid();

            // Start recharge
            newPlant.recharging = true;
            const plantItem = document.querySelector(`.plant-item[data-type="${plant.type}"]`);
            const rechargeOverlay = plantItem.querySelector('.recharge-overlay');
            const rechargeProgress = rechargeOverlay.querySelector('.recharge-progress');
            rechargeOverlay.style.display = 'block';
            rechargeProgress.style.width = '0%';

            let startTime = Date.now();
            const rechargeInterval = setInterval(() => {
                let elapsedTime = Date.now() - startTime;
                let progress = Math.min(elapsedTime / newPlant.rechargeTime, 1) * 100;
                rechargeProgress.style.width = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(rechargeInterval);
                    newPlant.recharging = false;
                    rechargeOverlay.style.display = 'none';
                }
            }, 100);
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    if (hoveredCell.row !== row || hoveredCell.col !== col) {
        hoveredCell = { row, col };
    }
});

canvas.addEventListener('mouseleave', () => {
    hoveredCell = { row: null, col: null };
});

// Define the cell structure
const createCell = (row, col) => ({
    row: row,
    col: col,
    plant: null,
    water: false,
    fertilizer: false,
});

// Initialize the grid with cell objects
const grid = Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, col) => createCell(row, col)));

// Function to draw the grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.strokeStyle = '#318a36'; // Grid line color
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * cellWidth;
            const y = row * cellHeight;
            const cell = grid[row][col];

            const isOddCell = col & 1 == 1;

            // Alternate cell colors
            if (row & 1 == 1) {
                if (!isOddCell) {
                    ctx.fillStyle = '#37a03d';
                    ctx.fillRect(x, y, cellWidth, cellHeight);
                }
            }
            else {
                if (isOddCell) {
                    ctx.fillStyle = '#37a03d';
                    ctx.fillRect(x, y, cellWidth, cellHeight);
                }
            }

            // Highlight the hovered cell
            if (hoveredCell.row === row && hoveredCell.col === col) {
                ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Yellow highlight with transparency
                ctx.fillRect(x, y, cellWidth, cellHeight);
            }

            // Draw the plant if it exists
            if (cell.plant) {
                drawPlant(cell.plant, x, y);
            }
        }
    }
    // Draw and move enemies
    enemies.forEach((enemy, index) => {
        if (isPaused) { return; }
        enemy.move();
        enemy.draw();

        // Check for collisions with plants and drain health
        for (let col = 0; col < cols; col++) {
            const cell = grid[enemy.row][col];
            if (cell.plant && enemy.checkCollisionWithPlant(cell)) {
                enemy.drainPlantHealth(cell);
            }
        }

        // Remove enemy if it goes off the left side of the canvas
        if (enemy.x + enemy.width < 0) {
            enemies.splice(index, 1);
        }
    });

    // Draw and move projectiles
    projectiles.forEach((projectile, index) => {
        if (isPaused) { return; }
        projectile.move();
        projectile.draw();

        // Check if the projectile has hit the target
        if (projectile.hasHitTarget()) {
            projectile.target.health -= projectile.damage; // Reduce the enemy's health by the projectile's damage
            console.log(`Projectile hit enemy at (${projectile.target.row}, ${projectile.target.x}).`);

            // Remove the enemy if its health drops to 0 or below
            if (projectile.target.health <= 0) {
                const enemyIndex = enemies.indexOf(projectile.target);
                if (enemyIndex > -1) {
                    enemies.splice(enemyIndex, 1);
                }
            }

            // Remove the projectile
            projectiles.splice(index, 1);
        }
    });
}

// Function to draw a plant
function drawPlant(plant, x, y) {
    const healthRatio = plant.health / plant.maxHealth;
    const colorShift = -Math.round((1 - healthRatio) * 10); // Adjust the value to control the darkness
    ctx.fillStyle = adjustLightness(plant.color, colorShift);
    ctx.fillRect(x + 10, y + 10, cellWidth - 20, cellHeight - 20); // Draw a simple rectangle as a plant
    // Draw the health of the plant in the middle
    ctx.fillStyle = '#000'; // Text color
    ctx.font = '16px Arial'; // Text font
    ctx.textAlign = 'center'; // Center align the text
    ctx.textBaseline = 'middle'; // Middle align the text
    ctx.fillText(plant.health, x + cellWidth / 2, y + cellHeight / 2);
}

// Function to create a sun element
function createSun() {
    if (isPaused) { return; }
    const canvasContainer = document.getElementById('canvas-container');
    const sunCounter = document.getElementById('sun-counter');

    const sun = document.createElement('div');
    const sunContainer = document.createElement('div');
    sun.classList.add('falling-circle');
    sunContainer.classList.add('sun-container');
    canvasContainer.appendChild(sunContainer);
    sunContainer.appendChild(sun);

    const canvasRect = canvas.getBoundingClientRect();
    const randomX = Math.random() * (canvasRect.width - 50); // Ensure the circle stays within bounds
    const randomY = Math.random() * (canvasRect.height - 50); // Ensure the circle stays within bounds

    sunContainer.style.left = `${randomX}px`;
    sunContainer.style.top = '0px'; // Start at the top

    // Animate the sun falling
    setTimeout(() => {
        sunContainer.style.top = `${randomY}px`; // Position the circle at a random position within the canvas
    }, 100); // Delay to ensure the initial position is set

    // Handle hover event
    sunContainer.addEventListener('mouseover', function sunHandler() {
        sun.style.backgroundColor = 'transparent'; // Make the sun transparent
        sunContainer.style.backgroundColor = 'transparent'; // Make the sun container transparent
        setTimeout(() => {
            sun.remove(); // Remove the sun element
            sunContainer.remove(); // Remove the sun container element
        }, 500); // Delay to ensure the animation is complete
        sunCount += 50;
        sunCounter.textContent = `Sun: ${sunCount}`; // Update the sun counter in the HTML
        sunContainer.removeEventListener('mouseover', sunHandler); // Remove the event listener
    });

    setTimeout(() => {
        if (sunContainer.parentElement) {
            sunContainer.remove();
        }
    }, sunTimeout); // 15 seconds
}

document.addEventListener('DOMContentLoaded', () => {
    function createRandomSun() {
        createSun();
        const randomInterval = Math.random() * (45000 - 15000) + 15000;
        setTimeout(createRandomSun, randomInterval);
    }

    createRandomSun();
});

// Function to handle plant actions
function handlePlantActions() {
    if (isPaused) { return; }
    const currentTime = Date.now(); // Get the current time
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            if (cell.plant) {

                if (cell.plant.health <= 0) {
                    cell.plant = null;
                    continue; // Skip further actions for this cell
                }

                switch (cell.plant.type) {
                    case 'Sunflower':
                        // Sunflower generates sun over time
                        if (Math.random() < 0.001) {
                            generateSun(cell);
                            console.log(`Sunflower at (${cell.row}, ${cell.col}) generated sun.`);
                        }
                        break;
                    case 'Peashooter':
                        // Peashooter attacks zombies
                        const enemiesInRow = enemies.filter(enemy => enemy.row === cell.row && enemy.x > cell.col * cellWidth);
                        if (enemiesInRow.length > 0 && currentTime - cell.plant.lastShotTime >= cell.plant.shootInterval) {
                            attackZombies(cell);
                            cell.plant.lastShotTime = currentTime;
                        }
                        break;
                    case 'Wall-nut':
                        // Wall-nut blocks zombies
                        blockZombies(cell);
                        break;
                    case 'Cherry Bomb':
                        if (cell.plant.shootInterval) {
                            continue;
                        }
                        cell.plant.shootInterval = true;
                        const initialColor = cell.plant.color;
                        let startTime = Date.now();

                        const colorInterval = setInterval(() => {
                            const elapsedTime = Date.now() - startTime;
                            const progress = Math.min(elapsedTime / 500, 1); // Calculate progress (0 to 1)
                            const lightness = 50 + progress * 50; // Increase lightness from 50% to 100%
                            try {
                                cell.plant.color = `hsl(0, 100%, ${lightness}%)`; // Update plant color
                            } catch (error) {
                                clearInterval(colorInterval);
                            }

                            if (progress >= 1) {
                                clearInterval(colorInterval);
                            }
                        }, 10);
                        setTimeout(() => {
                            handleExplosion(cell, 200);
                            cell.plant = null;
                        }, 500);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

function handleExplosion(cell, range) {
    if (isPaused) { return; }
    const enemiesInRange = enemies.filter(enemy => {
        const distance = Math.sqrt(Math.pow(enemy.x - (cell.col * cellWidth + cellWidth / 2), 2) + Math.pow(enemy.y - (cell.row * cellHeight + cellHeight / 2), 2));
        return distance <= range;
    });
    enemiesInRange.forEach(enemy => enemy.health -= cell.plant.damage);
    console.log('these zombies got hit ', enemiesInRange);
}

function generateSun(cell) {
    if (isPaused) { return; }
    const canvasContainer = document.getElementById('canvas-container');
    const sunCounter = document.getElementById('sun-counter');

    const sun = document.createElement('div');
    const sunContainer = document.createElement('div');
    sun.classList.add('falling-circle');
    sunContainer.classList.add('sun-container');
    canvasContainer.appendChild(sunContainer);
    sunContainer.appendChild(sun);

    const x = cell.col * cellWidth + cellWidth / 2;
    const y = cell.row * cellHeight + cellHeight / 2;

    // Calculate the space between the edge of the body and the left side of the canvas
    const canvasRect = canvas.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const offsetX = canvasRect.left - bodyRect.left;

    // Generate random position within a 100px radius of the sunflower
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 100;
    let randomX = x + radius * Math.cos(angle); // Adjust to keep within boundaries
    let randomY = y + radius * Math.sin(angle); // Adjust to keep within boundaries

    // Ensure the sun stays within the canvas boundaries
    randomX = Math.max(0, Math.min(canvas.width - 50, randomX));
    randomY = Math.max(0, Math.min(canvas.height, randomY));

    sunContainer.style.transition = 'none';
    sun.style.transition = 'none';

    sunContainer.style.left = `${randomX + offsetX - 60}px`;
    sunContainer.style.top = `${randomY + 70}px`;

    sun.style.transition = 'background-color 0.5s ease-in-out';

    // Handle hover event
    sunContainer.addEventListener('mouseover', function sunPlantHandler() {
        sun.style.backgroundColor = 'transparent'; // Make the sun transparent
        sunContainer.style.backgroundColor = 'transparent'; // Make the sun container transparent
        setTimeout(() => {
            sun.remove(); // Remove the sun element
            sunContainer.remove(); // Remove the sun container element
        }, 500); // Delay to ensure the animation is complete
        sunCount += 50;
        sunCounter.textContent = `Sun: ${sunCount}`; // Update the sun counter in the HTML
        sunContainer.removeEventListener('mouseover', sunPlantHandler); // Remove the event listener
    });

    setTimeout(() => {
        if (sunContainer.parentElement) {
            sunContainer.remove();
        }
    }, sunTimeout); // 15 seconds
}

// Function to attack zombies for Peashooter
function attackZombies(cell) {
    if (isPaused) { return; }
    const enemiesInRow = enemies.filter(enemy => enemy.row === cell.row && enemy.x > cell.col * cellWidth);
    if (enemiesInRow.length > 0) {
        const targetEnemy = enemiesInRow[0];
        shootProjectile(cell, targetEnemy);
        console.log(`Peashooter at (${cell.row}, ${cell.col}) shoots a projectile at enemy at (${targetEnemy.row}, ${targetEnemy.x}).`);
    }
}

// Function to block zombies for Wall-nut
function blockZombies(cell) {
    // Logic to block zombies
    // console.log(`Wall-nut at (${cell.row}, ${cell.col}) blocks zombies.`);
}

let gameTimer = 0; // Initialize game timer

function handleWaves() {
    if (isPaused) { return; }

    while (waveIndex < waves.length && gameTimer >= waves[waveIndex].time) {
        const wave = waves[waveIndex];
        spawnEnemy(wave.row, wave.speed);
        waveIndex++;
    }
}

function gameLoop() {
    if (!isPaused) {
        gameTimer += 1000 / 60; // Increment game timer by the frame duration
    }
    handleWaves();
    drawGrid();
    handlePlantActions();
    checkEnemyHealth();
}

function startGameLoop() {
    gameLoopInterval = setInterval(gameLoop, 1000 / 60);
    isPaused = false;
    pauseMenu.style.display = 'none';
}

function stopGameLoop() {
    clearInterval(gameLoopInterval);
    isPaused = true;
    pauseMenu.style.display = 'block';
}

function checkEnemyHealth() {
    if (isPaused) { return; }
    enemies.forEach((enemy, index) => {
        if (enemy.health <= 0) {
            enemies.splice(index, 1);
        }
    });
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopGameLoop();
    } else {
        startGameLoop();
    }
});

// Start the game loop initially
startGameLoop();

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !isPaused) {
        stopGameLoop();
    }
    else if (event.key === 'Escape' && isPaused) {
        startGameLoop();
    }
});