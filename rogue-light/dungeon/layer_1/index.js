// import { bfsPathfinding, smoothPath, isPathClear } from '../../resources/js/pathfinding.js';
import { bfsPathfinding } from '../../resources/js/pathfinding.js';

// Configuration variables
const tileSize = 40;                // tile size in pixels
const levelWidth = 90;              // level width in tiles
const levelHeight = 40;             // level height in tiles
const playerColor = 0x00ff00;       // Player color
const exitRoomColor = 0x006400;     // Exit room color
const exitTileColor = 0x0000ff;     // Exit tile color
let playerSpeed = 260;              // Player speed 
let enemySpeed = 200;               // Enemy speed
const normalRoomColor = 0xbdb356;   // Normal room color
const enemyOffset = 1;              // Offset for enemies that get stuck
const revealMinimap = JSON.parse(localStorage.getItem('rogueLight-revealMinimap')) || false; // Boolean to control minimap visibility
let seed = localStorage.getItem('rogueLight-seed') || Math.random().toString(36).substr(2, 9); // Global variable for the seed
const startWithSword = JSON.parse(localStorage.getItem('rogueLight-startWithSword')) || false; // Boolean to control starting with a sword

const playerSpeedElement = document.getElementById('playerSpeed');
const debugMode = JSON.parse(localStorage.getItem('rogueLight-debugMode')) || false; // Enable or disable debug mode

let config = {
    type: Phaser.AUTO,
    width: 800, // Viewport width
    height: 600, // Viewport height
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let level;
let minimap;
let minimapContext;
let rooms = []; // Array to store rooms with their features and colors
let enemySpawnLocations = []; // Array to store enemy spawn locations
let playerHealth = 100; // Player health
const healthDisplayElement = document.getElementById('health-display');
const healthBarElement = document.getElementById('health-bar');

function preload() {
    this.load.image('wall', '../../resources/img/stone_brick_texture.png');
}

playerSpeedElement.value = `${playerSpeed}`;

class Enemy {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.add.rectangle(x * tileSize, y * tileSize, (tileSize - 5), (tileSize - 5), 0xff0000).setOrigin(0); // Red color for enemy
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setSize(tileSize, tileSize); // Set the hitbox size
        this.path = [];
        this.pathIndex = 0;
        this.debugGraphics = scene.add.graphics(); // Add graphics for debugging
        this.seen = false; // Add seen property
        this.previousPosition = { x: Math.floor(this.sprite.x / tileSize), y: Math.floor(this.sprite.y / tileSize) }; // Add previous position
        this.enemyFrameCounter = 0; // Add a counter to track frames for position check
        this.stuckCounter = 0; // Add a counter to track how long the enemy has been stuck
    }

    recalculatePath(playerX, playerY) {
        const startX = Math.floor(this.sprite.x / tileSize);
        const startY = Math.floor(this.sprite.y / tileSize);
        const endX = Math.floor(playerX / tileSize);
        const endY = Math.floor(playerY / tileSize);
        this.path = bfsPathfinding(startX, startY, endX, endY, level);
        this.pathIndex = 0;

        // Skip the first node if the enemy is already close to it
        if (this.path.length > 1) {
            const nextPoint = this.path[1];
            const nextX = nextPoint.x * tileSize + tileSize / 2 - this.sprite.width / 2;
            const nextY = nextPoint.y * tileSize + tileSize / 2 - this.sprite.height / 2;
            const dx = nextX - this.sprite.x;
            const dy = nextY - this.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 4) {
                this.pathIndex++;
            }
        }
    }

    update(playerX, playerY) {
        if (debugMode) {
            this.debugGraphics.clear();
            this.debugGraphics.lineStyle(2, 0x00ff00, 1);
            for (let i = 0; i < this.path.length - 1; i++) {
                const startX = this.path[i].x * tileSize + tileSize / 2;
                const startY = this.path[i].y * tileSize + tileSize / 2;
                const endX = this.path[i + 1].x * tileSize + tileSize / 2;
                const endY = this.path[i + 1].y * tileSize + tileSize / 2;
                this.debugGraphics.strokeLineShape(new Phaser.Geom.Line(startX, startY, endX, endY));
            }
            // Draw enemy hitbox
            this.debugGraphics.lineStyle(2, 0x00ff00, 1);
            this.debugGraphics.strokeRect(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
        }
        if (!this.seen) {
            return; // Do nothing if the enemy has not been seen
        }
        if (this.path.length === 0 || this.pathIndex >= this.path.length) {
            this.recalculatePath(playerX, playerY);
        }
        let dx = 0, dy = 0; // Define dx and dy variables
        if (this.path.length > 0 && this.pathIndex < this.path.length) {
            const nextPoint = this.path[this.pathIndex];
            const nextX = nextPoint.x * tileSize + tileSize / 2 - this.sprite.width / 2;
            const nextY = nextPoint.y * tileSize + tileSize / 2 - this.sprite.height / 2;
            dx = nextX - this.sprite.x;
            dy = nextY - this.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 2) {
                this.pathIndex++;
            } else {
                this.sprite.body.setVelocity(dx / distance * enemySpeed, dy / distance * enemySpeed);
            }
        } else {
            this.sprite.body.setVelocity(0, 0);
        }
        if (this.enemyFrameCounter % 20 === 0) {
            const currentX = Math.floor(this.sprite.x / tileSize);
            const currentY = Math.floor(this.sprite.y / tileSize);
            if (currentX === this.previousPosition.x && currentY === this.previousPosition.y) {
                this.stuckCounter++;
                console.log(`Enemy stuck at (${Math.floor(this.sprite.x)}, ${Math.floor(this.sprite.y)}), moving away from the closest wall`);
                const distances = {
                    left: this.getDistanceToWall(currentX, currentY, -1, 0),
                    right: this.getDistanceToWall(currentX, currentY, 1, 0),
                    up: this.getDistanceToWall(currentX, currentY, 0, -1),
                    down: this.getDistanceToWall(currentX, currentY, 0, 1),
                    upLeft: this.getDistanceToWall(currentX, currentY, -1, -1),
                    upRight: this.getDistanceToWall(currentX, currentY, 1, -1),
                    downLeft: this.getDistanceToWall(currentX, currentY, -1, 1),
                    downRight: this.getDistanceToWall(currentX, currentY, 1, 1)
                };
                const closestDirection = Object.keys(distances).reduce((a, b) => distances[a] < distances[b] ? a : b);
                switch (closestDirection) {
                    case 'left':
                        this.sprite.x += enemyOffset;
                        break;
                    case 'right':
                        this.sprite.x -= enemyOffset;
                        break;
                    case 'up':
                        this.sprite.y += enemyOffset;
                        break;
                    case 'down':
                        this.sprite.y -= enemyOffset;
                        break;
                    case 'upLeft':
                        this.sprite.x += enemyOffset;
                        this.sprite.y += enemyOffset;
                        break;
                    case 'upRight':
                        this.sprite.x -= enemyOffset;
                        this.sprite.y += enemyOffset;
                        break;
                    case 'downLeft':
                        this.sprite.x += enemyOffset;
                        this.sprite.y -= enemyOffset;
                        break;
                    case 'downRight':
                        this.sprite.x -= enemyOffset
                        this.sprite.y -= enemyOffset;
                        break;
                }
                // this.recalculatePath(playerX, playerY);
                this.stuckCounter = 0;
            } else {
                this.stuckCounter = 0;
            }
            this.previousPosition = { x: currentX, y: currentY };
        }
        this.enemyFrameCounter++;
    }

    getDistanceToWall(x, y, dx, dy) {
        let distance = 0;
        while (level[y + dy * distance] && level[y + dy * distance][x + dx * distance] === 0) {
            distance++;
        }
        return distance;
    }
}

class Weapon {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type;
        this.sprite = scene.add.rectangle(x * tileSize, y * tileSize, tileSize / 2, tileSize, 0x808080).setOrigin(0.5); // Grey color for weapon, rectangle shape
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCollideWorldBounds(true);
        this.angle = 0; // Initialize angle
    }

    update(player, pointerX, pointerY) {
        // Position the weapon in front of the player and rotate towards the pointer coordinates
        this.angle = Phaser.Math.Angle.Between(player.x, player.y, pointerX, pointerY);
        this.sprite.x = player.x + Math.cos(this.angle) * tileSize;
        this.sprite.y = player.y + Math.sin(this.angle) * tileSize;
        this.sprite.rotation = this.angle;
    }

    attack() {
        const attackRange = tileSize * 1.5; // Define the attack range
        const attackAngle = this.angle;
        const attackX = this.sprite.x + Math.cos(attackAngle) * attackRange;
        const attackY = this.sprite.y + Math.sin(attackAngle) * attackRange;

        // Check for enemies within the attack range
        this.scene.enemies = this.scene.enemies.filter(enemy => {
            const distance = Phaser.Math.Distance.Between(attackX, attackY, enemy.sprite.x, enemy.sprite.y);
            if (distance < tileSize) {
                enemy.sprite.destroy(); // Destroy the enemy if within range
                console.log('Enemy hit!');
                return false; // Remove the enemy from the array
            }
            return true; // Keep the enemy in the array
        });
    }
}

export { Enemy };

function create() {
    this.walls = this.physics.add.staticGroup();
    this.exposedWalls = this.physics.add.staticGroup();
    this.rooms = this.add.group();
    this.features = this.add.group();
    this.enemies = [];
    this.enemyGroup = this.add.group();

    // Use the global seed variable or generate a random one if it is empty
    const seedValue = seed || Math.random().toString(36).substr(2, 9);
    console.log('Seed:', seedValue);
    const playerPosition = generateLevel(this, seedValue);

    // Create player as a simple rectangle
    this.player = this.add.rectangle(playerPosition.x, playerPosition.y, tileSize, tileSize, playerColor);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.health = playerHealth; // Initialize player health

    // Check if the player should start with a sword
    if (startWithSword) {
        this.weapon = new Weapon(this, playerPosition.x / tileSize, playerPosition.y / tileSize, 'melee');
    }

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.enemyGroup, this.walls); // Add collision between enemies and walls
    this.physics.add.overlap(this.player, this.enemyGroup, playerHit, null, this); // Add overlap detection
    this.weapon = null; // Initialize weapon as null
    
    this.physics.add.overlap(this.player, this.features, (player, feature) => {
        pickupWeapon.call(this, player, feature);
        if (feature.fillColor === 13619151) {
            handleExit.call(this);
        }
    }, null, this); // Add overlap detection for weapon pickup with logging

    // Set up the camera to follow the player
    this.cameras.main.setBounds(0, 0, levelWidth * tileSize, levelHeight * tileSize);
    this.cameras.main.startFollow(this.player);

    // Adjust world bounds to match the dungeon size
    this.physics.world.setBounds(0, 0, levelWidth * tileSize, levelHeight * tileSize);

    // Initialize the Mrpas field of view algorithm
    this.fov = new Mrpas(levelWidth, levelHeight, (x, y) => {
        const tile = level[y] && level[y][x];
        return tile === 0;
    });

    // Set all tiles, rooms, and features to be invisible initially
    this.walls.getChildren().forEach(wall => wall.setAlpha(0));
    this.exposedWalls.getChildren().forEach(wall => wall.setAlpha(0));
    this.rooms.getChildren().forEach(room => room.setAlpha(0));
    this.features.getChildren().forEach(feature => feature.setAlpha(0));

    this.frameCounter = 0;

    minimap = document.querySelector('.minimap');
    minimapContext = minimap.getContext('2d');
    minimap.width = levelWidth;
    minimap.height = levelHeight;

    this.updateMinimap = updateMinimap.bind(this);

    // Reveal the whole map if the revealMinimap flag is true
    if (revealMinimap) {
        this.rooms.getChildren().forEach(room => {
            room.setAlpha(1);
            room.seen = true;
        });
        this.exposedWalls.getChildren().forEach(wall => {
            wall.setAlpha(1);
            wall.seen = true;
        });
        this.features.getChildren().forEach(feature => {
            feature.setAlpha(1);
            feature.seen = true;
        });
    }

    document.getElementById('seed-display').innerText = `Seed: ${seedValue}`;

    this.input.on('pointerdown', () => {
        if (this.weapon) {
            this.weapon.attack(); // Call the attack function when the pointer is pressed
        }
    });

}

function pickupWeapon(player, feature) {
    if (feature.fillColor === 0xffd700) { // Check if the feature is a chest
        if (this.weapon) {
            console.log('Player already has a weapon');
            return; // Do nothing if the player already has a weapon
        }
        this.weapon = new Weapon(this, player.x / tileSize, player.y / tileSize, 'melee');
        feature.destroy(); // Remove the chest from the map
        console.log('Player picked up a weapon');
    }
}

function playerHit(player, enemy) {
    player.health -= 1; // Decrease player health by 1
    if (player.health <= 0) {
        player.health = 0;
        // Handle player death (e.g., redirect to game over screen)
        console.log('Player is dead');
        const score = calculateScore(); // Replace with actual score calculation
        const layersSurvived = calculateLayersSurvived(); // Replace with actual layers survived calculation
        window.location.href = `../../game-over.html?score=${score}&layersSurvived=${layersSurvived}`; // Redirect to game over screen with query parameters
    }
}

function calculateScore() {
    // Implement score calculation logic here
    return "W.I.P."; // Placeholder value
}

function calculateLayersSurvived() {
    // Implement layers survived calculation logic here
    return "1"; // Placeholder value
}

function update() {
    // Update player speed every 30 frames
    if (this.frameCounter % 30 === 0) {
        try {
            playerSpeed = parseInt(playerSpeedElement.value);
        } catch (error) {
            alert('Invalid player speed value!');
            console.error(error);
        }
    }

    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-playerSpeed);
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(playerSpeed);
    }

    if (this.cursors.up.isDown) {
        this.player.body.setVelocityY(-playerSpeed);
    } else if (this.cursors.down.isDown) {
        this.player.body.setVelocityY(playerSpeed);
    }

    // Filter out destroyed enemies before updating them
    this.enemies = this.enemies.filter(enemy => {
        if (enemy.sprite.active) {
            enemy.update(this.player.x, this.player.y);
            return true;
        }
        return false;
    });

    if (this.weapon) {
        const pointer = this.input.activePointer;
        const pointerWorldX = pointer.x + this.cameras.main.scrollX;
        const pointerWorldY = pointer.y + this.cameras.main.scrollY;
        this.weapon.update(this.player, pointerWorldX, pointerWorldY); // Update weapon position and rotation if equipped
    }

    // Only update the FoV every 5 frames
    if (this.frameCounter % 5 === 0) {
        // Set all tiles, rooms, and features to be slightly visible if seen, invisible if not seen
        this.walls.getChildren().forEach(wall => {
            wall.setAlpha(wall.seen ? 0.5 : 0);
        });
        this.exposedWalls.getChildren().forEach(wall => {
            wall.setAlpha(wall.seen ? 0.5 : 0);
        });
        this.rooms.getChildren().forEach(room => {
            room.setAlpha(room.seen ? 0.5 : 0);
        });
        this.features.getChildren().forEach(feature => {
            if (feature.fillColor !== 0xff0000) { // Exclude enemies from opacity changes
                feature.setAlpha(feature.seen ? 0.5 : 0);
            } else {
                const enemy = this.enemies.find(e => e.sprite === feature);
                if (enemy) {
                    enemy.seen = true; // Mark enemy as seen
                }
            }
        });

        this.enemies.forEach(enemy => {
            const enemyX = Math.floor(enemy.sprite.x / tileSize);
            const enemyY = Math.floor(enemy.sprite.y / tileSize);
            let enemyVisible = false;
            this.fov.compute(
                Math.floor(this.player.x / tileSize),
                Math.floor(this.player.y / tileSize),
                10,
                (x, y) => level[y] && level[y][x] === 0,
                (x, y) => {
                    const tile = level[y] && level[y][x];
                    if (tile === 0) {
                        const room = this.rooms.getChildren().find(r => r.x === x * tileSize && r.y === y * tileSize);
                        if (room) {
                            room.setAlpha(1);
                            room.seen = true;
                        }
                    } else if (tile === 1 || tile === 2) {
                        const wall = this.walls.getChildren().find(w => w.x === x * tileSize && w.y === y * tileSize);
                        if (wall) {
                            wall.setAlpha(1);
                            wall.seen = true;
                        }
                    }
                    const feature = this.features.getChildren().find(f => f.x === x * tileSize && f.y === y * tileSize);
                    if (feature) {
                        feature.setAlpha(1);
                        feature.seen = true;
                    }
                    if (x === enemyX && y === enemyY) {
                        enemy.seen = true; // Mark enemy as seen
                        enemyVisible = true; // Mark enemy as visible
                    }
                }
            );
            enemy.sprite.setAlpha(enemyVisible ? 1 : 0); // Set enemy visibility
        });

        this.updateMinimap();
    }
    // Update health bar width
    healthBarElement.style.width = `${(this.player.health / 100) * 100}%`;
    this.frameCounter++;
}

function updateMinimap() {
    minimapContext.clearRect(0, 0, minimap.width, minimap.height);
    // Draw rooms on the minimap
    this.rooms.getChildren().forEach(tile => {
        if (tile.seen || revealMinimap) {
            minimapContext.fillStyle = '#000';              // Yellow color for rooms
            minimapContext.fillRect(tile.x / tileSize, tile.y / tileSize, 1, 1);
        }
    });
    // Draw features on the minimap
    this.features.getChildren().forEach(feature => {
        if (feature.seen) {
            if (feature.fillColor === 0xffd700) {           // Chest color
                minimapContext.fillStyle = '#ffd700';
            } else if (feature.fillColor === 0xcfcfcf) {    // Trap color
                minimapContext.fillStyle = '#cfcfcf';
            } else if (feature.fillColor === 0x006400) {    // Exit room color
                minimapContext.fillStyle = '#006400';
            } else if (feature.fillColor === 0x0000ff) {    // Exit tile color
                minimapContext.fillStyle = '#5454ff';
            }
            minimapContext.fillRect(feature.x / tileSize, feature.y / tileSize, 1, 1);
        }
    });
    // Draw exposed walls on the minimap
    this.exposedWalls.getChildren().forEach(wall => {
        if (wall.seen || revealMinimap) {
            minimapContext.fillStyle = '#d3d3d3';
            minimapContext.fillRect(wall.x / tileSize, wall.y / tileSize, 1, 1);
        }
    });
    // Draw enemies on the minimap
    if (debugMode) {
        this.enemies.forEach(enemy => {
            minimapContext.fillStyle = '#ff0000'; // Red color for enemies
            minimapContext.fillRect(Math.floor(enemy.sprite.x / tileSize), Math.floor(enemy.sprite.y / tileSize), 1, 1);
        });
    }
    // Draw player position on minimap
    minimapContext.fillStyle = '#00ff00';
    minimapContext.fillRect(Math.floor(this.player.x / tileSize), Math.floor(this.player.y / tileSize), 1, 1);
}

const features = ['chest', 'enemies', 'trap'];

function addFeature(scene, feature, x, y) {
    let featureSprite;
    switch (feature) {
        case 'chest':
            // Mockup for adding a chest
            featureSprite = scene.add.rectangle(x * tileSize, y * tileSize, tileSize, tileSize, 0xffd700).setOrigin(0); // Gold color for chest
            scene.physics.add.existing(featureSprite); // Add physics body to the chest
            break;
        case 'enemies':
            // Store enemy spawn location instead of creating enemy immediately
            enemySpawnLocations.push({ x, y });
            break;
        case 'trap':
            // Mockup for adding a trap
            featureSprite = scene.add.rectangle(x * tileSize, y * tileSize, tileSize, tileSize, 0xcfcfcf).setOrigin(0); // grey color for trap
            scene.physics.add.existing(featureSprite); // Add physics body to the trap
            break;
    }
    if (featureSprite) {
        scene.features.add(featureSprite);
        featureSprite.setAlpha(0); // Ensure the feature is visible for testing
    }
}

function generateLevel(scene, seed) {
    // Initialize the seeded random number generator
    Math.seedrandom(seed);

    // Create a 2D array to represent the level
    level = Array.from({
        length: levelHeight
    }, () => Array(levelWidth).fill(1));

    function createRoom(x, y, width, height, color = normalRoomColor) {
        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                level[i][j] = 0;
                const tile = scene.add.rectangle(j * tileSize, i * tileSize, tileSize, tileSize, color).setOrigin(0);
                scene.rooms.add(tile);
                tile.setAlpha(0);
            }
        }
        markExposedWalls(x, y, width, height);
    }

    function createHorizontalHallway(x1, x2, y, color = normalRoomColor) {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            for (let offset = -1; offset <= 1; offset++) {
                if (level[y + offset][x] !== 0) {
                    level[y + offset][x] = 0;
                    const hallway = scene.add.rectangle(x * tileSize, (y + offset) * tileSize, tileSize, tileSize, color).setOrigin(0);
                    scene.rooms.add(hallway);
                    hallway.setAlpha(0);
                    markExposedWalls(x, y + offset, 1, 1);
                }
            }
        }
    }

    function createVerticalHallway(y1, y2, x, color = normalRoomColor) {
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            for (let offset = -1; offset <= 1; offset++) {
                if (level[y][x + offset] !== 0) {
                    level[y][x + offset] = 0;
                    const hallway = scene.add.rectangle((x + offset) * tileSize, y * tileSize, tileSize, tileSize, color).setOrigin(0);
                    scene.rooms.add(hallway);
                    hallway.setAlpha(0);
                    markExposedWalls(x + offset, y, 1, 1);
                }
            }
        }
    }

    function markExposedWalls(x, y, width, height) {
        for (let i = y - 1; i <= y + height; i++) {
            for (let j = x - 1; j <= x + width; j++) {
                if (i >= 0 && i < levelHeight && j >= 0 && j < levelWidth && level[i][j] === 1) {
                    level[i][j] = 2;
                }
            }
        }
    }

    // Create the starting room (4x4) at the top-left corner
    const startX = 1;
    const startY = 1;
    createRoom(startX, startY, 4, 4);

    rooms = [{
        x: startX,
        y: startY,
        width: 4,
        height: 4
    }];

    // Ensure the exit room is created
    let exitRoomCreated = false;
    let chestRoomCreated = false; // Ensure at least one chest room is created

    // Create rooms
    for (let i = 0; i < 10; i++) {
        const roomWidth = Math.floor(Math.random() * 5) + 4;
        const roomHeight = Math.floor(Math.random() * 5) + 4;

        // Ensure room fits within borders
        const roomX = Math.floor(Math.random() * (levelWidth - roomWidth - 1)) + 1;
        const roomY = Math.floor(Math.random() * (levelHeight - roomHeight - 1)) + 1;

        // Ensure the room does not overlap with existing rooms and has a 2-tile gap
        let overlap = false;
        for (const room of rooms) {
            if (roomX < room.x + room.width + 2 && roomX + roomWidth + 2 > room.x &&
                roomY < room.y + room.height + 2 && roomY + roomHeight + 2 > room.y) {
                overlap = true;
                break;
            }
        }

        if (!overlap) {
            createRoom(roomX, roomY, roomWidth, roomHeight);
            rooms.push({
                x: roomX,
                y: roomY,
                width: roomWidth,
                height: roomHeight
            });

            // Randomly add a feature to the room
            if (Math.random() < 0.5) { // 50% chance to add a feature
                const randomValue = Math.random();
                let feature;
                if (randomValue < 0.4) {
                    feature = 'trap';
                } else if (randomValue < 0.8) {
                    feature = 'enemies';
                } else {
                    feature = 'chest';
                }
                addFeature(scene, feature, roomX + Math.floor(roomWidth / 2), roomY + Math.floor(roomHeight / 2));
                if (feature === 'chest') {
                    chestRoomCreated = true;
                }
            }

            // Check if this room can be the exit room
            if (!exitRoomCreated && Math.random() < 0.2) { // 20% chance to be the exit room
                createRoom(roomX, roomY, roomWidth, roomHeight, exitRoomColor);
                const exitTileX = roomX + Math.floor(roomWidth / 2);
                const exitTileY = roomY + Math.floor(roomHeight / 2);
                const exitTile = scene.add.rectangle(exitTileX * tileSize, exitTileY * tileSize, tileSize, tileSize, exitTileColor).setOrigin(0); // Blue color for the exit tile
                scene.features.add(exitTile);
                exitTile.setAlpha(0);
                addFeature(scene, 'enemies', exitTileX, exitTileY); // Ensure the exit room contains an enemy
                exitRoomCreated = true;
            }
        }
    }

    // If no exit room was created, designate the last room as the exit room
    if (!exitRoomCreated) {
        const lastRoom = rooms[rooms.length - 1];
        createRoom(lastRoom.x, lastRoom.y, lastRoom.width, lastRoom.height, exitRoomColor);
        const exitTileX = lastRoom.x + Math.floor(lastRoom.width / 2);
        const exitTileY = lastRoom.y + Math.floor(lastRoom.height / 2);
        const exitTile = scene.add.rectangle(exitTileX * tileSize, exitTileY * tileSize, tileSize, tileSize, exitTileColor).setOrigin(0); // Blue color for the exit tile
        scene.features.add(exitTile);
        exitTile.setAlpha(0);
        addFeature(scene, 'enemies', exitTileX, exitTileY); // Ensure the exit room contains an enemy
        exitRoomCreated = true;
    }

    // If no chest room was created and the last room is not the exit room, designate the last room as the chest room
    if (!chestRoomCreated && !exitRoomCreated) {
        const lastRoom = rooms[rooms.length - 1];
        addFeature(scene, 'chest', lastRoom.x + Math.floor(lastRoom.width / 2), lastRoom.y + Math.floor(lastRoom.height / 2));
        // } else if (!chestRoomCreated) {
        //     // Find a room that is not the exit room to designate as the chest room
        //     for (let i = rooms.length - 2; i >= 0; i--) {
        //         const room = rooms[i];
        //         if (room.x !== lastRoom.x || room.y !== lastRoom.y) {
        //             addFeature(scene, 'chest', room.x + Math.floor(room.width / 2), room.y + Math.floor(room.height / 2));
        //             break;
        //         }
        //     }
    }

    // If no chest room was created, add an additional room for the chest
    if (!chestRoomCreated) {
        let additionalRoomCreated = false;
        while (!additionalRoomCreated) {
            const roomWidth = Math.floor(Math.random() * 5) + 4;
            const roomHeight = Math.floor(Math.random() * 5) + 4;
            const roomX = Math.floor(Math.random() * (levelWidth - roomWidth - 1)) + 1;
            const roomY = Math.floor(Math.random() * (levelHeight - roomHeight - 1)) + 1;

            let overlap = false;
            for (const room of rooms) {
                if (roomX < room.x + room.width + 2 && roomX + roomWidth + 2 > room.x &&
                    roomY < room.y + room.height + 2 && roomY + roomHeight + 2 > room.y) {
                    overlap = true;
                    break;
                }
            }

            if (!overlap) {
                createRoom(roomX, roomY, roomWidth, roomHeight);
                rooms.push({ x: roomX, y: roomY, width: roomWidth, height: roomHeight });
                addFeature(scene, 'chest', roomX + Math.floor(roomWidth / 2), roomY + Math.floor(roomHeight / 2));
                additionalRoomCreated = true;
            }
        }
    }

    if (debugMode) {
        console.log('Rooms:', rooms);
        console.log('Enemy spawn locations:', enemySpawnLocations);
    }

    // Connect rooms with hallways
    for (let i = 1; i < rooms.length; i++) {
        const prevRoom = rooms[i - 1];
        const currRoom = rooms[i];

        const prevCenterX = prevRoom.x + Math.floor(prevRoom.width / 2);
        const prevCenterY = prevRoom.y + Math.floor(prevRoom.height / 2);
        const currCenterX = currRoom.x + Math.floor(currRoom.width / 2);
        const currCenterY = currRoom.y + Math.floor(currRoom.height / 2);

        // Create L-shaped hallways
        if (prevCenterX !== currCenterX && prevCenterY !== currCenterY) {
            createVerticalHallway(prevCenterY, currCenterY, prevCenterX, 0x1f1f1f);
            createHorizontalHallway(prevCenterX, currCenterX, currCenterY, 0x1f1f1f);
        } else if (prevCenterX !== currCenterX) {
            createHorizontalHallway(prevCenterX, currCenterX, prevCenterY, 0x1f1f1f);
        } else if (prevCenterY !== currCenterY) {
            createVerticalHallway(prevCenterY, currCenterY, prevCenterX, 0x1f1f1f);
        }
    }

    // Ensure all rooms are accessible by connecting any isolated rooms
    for (let i = 0; i < rooms.length; i++) {
        for (let j = i + 1; j < rooms.length; j++) {
            const roomA = rooms[i];
            const roomB = rooms[j];

            const centerAX = roomA.x + Math.floor(roomA.width / 2);
            const centerAY = roomA.y + Math.floor(roomA.height / 2);
            const centerBX = roomB.x + Math.floor(roomB.width / 2);
            const centerBY = roomB.y + Math.floor(roomB.height / 2);

            if (!isConnected(centerAX, centerAY, centerBX, centerBY)) {
                if (Math.random() < 0.5) {
                    createHorizontalHallway(centerAX, centerBX, centerAY, 0x6c8a58);
                    createVerticalHallway(centerAY, centerBY, centerBX, 0x6c8a58);
                } else {
                    createVerticalHallway(centerAY, centerBY, centerAX, 0x6c8a58);
                    createHorizontalHallway(centerAX, centerBX, centerBY, 0x6c8a58);
                }
            }
        }
    }

    // Create walls based on the level array
    for (let y = 0; y < levelHeight; y++) {
        for (let x = 0; x < levelWidth; x++) {
            if (level[y][x] === 1) {
                const wall = scene.add.image(x * tileSize, y * tileSize, 'wall').setOrigin(0);
                scene.physics.add.existing(wall, true);
                scene.walls.add(wall);
                wall.setAlpha(0);
            } else if (level[y][x] === 2) {
                const wall = scene.add.image(x * tileSize, y * tileSize, 'wall').setOrigin(0);
                scene.physics.add.existing(wall, true);
                scene.walls.add(wall);
                scene.exposedWalls.add(wall);
                wall.setAlpha(0);
            }
        }
    }

    // Player starting position in the middle of the 4x4 room
    const playerX = (startX + 2) * tileSize;
    const playerY = (startY + 2) * tileSize;

    // Add enemies after hallways and walls are created
    enemySpawnLocations.forEach(location => {
        const enemy = new Enemy(scene, location.x, location.y);
        scene.enemyGroup.add(enemy.sprite);
        scene.enemies.push(enemy);
    });

    return {
        x: playerX,
        y: playerY
    };
}

function isConnected(x1, y1, x2, y2) {
    const queue = [{ x: x1, y: y1 }];
    const visited = new Set();
    visited.add(`${x1},${y1}`);

    while (queue.length > 0) {
        const { x, y } = queue.shift();
        if (x === x2 && y === y2) return true;

        const neighbors = [
            { x: x - 1, y },
            { x: x + 1, y },
            { x, y: y - 1 },
            { x, y: y + 1 }
        ];

        for (const neighbor of neighbors) {
            const key = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(key) && level[neighbor.y] && level[neighbor.y][neighbor.x] === 0) {
                queue.push(neighbor);
                visited.add(key);
            }
        }
    }

    return false;
}

function handleExit() {
    // Collect the items the player has collected
    const collectedItems = ['test', 'test2']; // Replace with actual logic to collect items

    // Redirect to the new page with collected items as query parameters
    const itemsQuery = collectedItems.map(item => `item=${encodeURIComponent(item)}`).join('&');
    window.location.href = `../exit.html?${itemsQuery}`;
}