<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RogueLight - Layer 1</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/phaser-raycaster@0.10.10/dist/phaser-raycaster.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <script>
        // Configuration variables
        const tileSize = 40;
        const levelWidth = 90; // Increased level width
        const levelHeight = 40; // Increased level height
        const playerColor = 0x00ff00; // Player color
        const exitRoomColor = 0x006400; // Exit room color
        const exitTileColor = 0x0000ff; // Exit tile color
        const playerSpeed = 260; // Player speed
        const normalRoomColor = 0xbdb356; // Normal room color

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
            },
            plugins: {
                scene: [{
                    key: 'PhaserRaycaster',
                    plugin: PhaserRaycaster,
                    mapping: 'raycasterPlugin'
                }]
            }
        };

        const game = new Phaser.Game(config);

        function preload() {
            this.load.image('wall', '../../resources/img/stone_brick_texture.png'); // Preload the wall texture
        }

        function create() {
            // Create walls as simple rectangles
            this.walls = this.physics.add.staticGroup();
            this.exposedWalls = this.physics.add.staticGroup(); // Group for exposed walls
            const seed = Math.random().toString(36).substr(2, 9); // Generate a random seed
            console.log('Seed:', seed);
            const playerPosition = generateLevel(this, seed); // Pass the random seed

            // Create player as a simple rectangle at the determined position
            this.player = this.add.rectangle(playerPosition.x, playerPosition.y, tileSize, tileSize, playerColor);
            this.physics.add.existing(this.player);
            this.player.body.setCollideWorldBounds(true);

            // Enable cursor keys for player movement
            this.cursors = this.input.keyboard.createCursorKeys();

            // Add collider after player and walls are created
            this.physics.add.collider(this.player, this.walls);

            // Set up the camera to follow the player
            this.cameras.main.setBounds(0, 0, levelWidth * tileSize, levelHeight * tileSize);
            this.cameras.main.startFollow(this.player);

            // Adjust world bounds to match the dungeon size
            this.physics.world.setBounds(0, 0, levelWidth * tileSize, levelHeight * tileSize);

            // Initialize the raycaster
            this.raycaster = this.raycasterPlugin.createRaycaster({
                debug: true, // Disable debug mode for better performance
                mapSegmentCount: 128 // Reduce the number of segments for better performance
            });
            this.ray1 = this.raycaster.createRay({
                origin: {
                    x: this.player.x,
                    y: this.player.y
                },
                angle: 0,
                collisionRange: 500 // Limit the range to reduce calculations
            });
            this.ray2 = this.raycaster.createRay({
                origin: {
                    x: this.player.x,
                    y: this.player.y
                },
                angle: 0,
                collisionRange: 500 // Limit the range to reduce calculations
            });
            this.ray3 = this.raycaster.createRay({
                origin: {
                    x: this.player.x,
                    y: this.player.y
                },
                angle: 0,
                collisionRange: 500 // Limit the range to reduce calculations
            });
            this.ray4 = this.raycaster.createRay({
                origin: {
                    x: this.player.x,
                    y: this.player.y
                },
                angle: 0,
                collisionRange: 500 // Limit the range to reduce calculations
            });

            // Set the raycaster to map the walls
            this.raycaster.mapGameObjects(this.exposedWalls.getChildren());

            // Create a graphics object for the viewing cone
            this.graphics = this.add.graphics({
                fillStyle: {
                    color: 0xffffff,
                    alpha: 0.2
                }
            });

            // Create a graphics object for the overlay
            this.overlayGraphics = this.add.graphics({
                fillStyle: {
                    color: 0xffffff,
                    alpha: 1
                }
            });

            // Frame counter for optimizing drawing frequency
            this.frameCounter = 0;
        }

        function update() {
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

            // Update the rays' origin to the player's position
            this.ray1.setOrigin(this.player.x, this.player.y);
            this.ray2.setOrigin(this.player.x, this.player.y);
            this.ray3.setOrigin(this.player.x, this.player.y);
            this.ray4.setOrigin(this.player.x, this.player.y);

            // Only update the viewing cone every 5 frames
            if (this.frameCounter % 10 === 0) {
                const intersections = [];
                for (let angle = 0; angle < 360; angle += 15) { // Adjust the step to balance performance and accuracy
                    this.ray1.setAngle(Phaser.Math.DegToRad(angle));
                    this.ray2.setAngle(Phaser.Math.DegToRad(angle + 5)); // Offset the second ray by 2 degrees
                    this.ray3.setAngle(Phaser.Math.DegToRad(angle + 10)); // Offset the third ray by 4 degrees
                    this.ray4.setAngle(Phaser.Math.DegToRad(angle + 15)); // Offset the fourth ray by 6 degrees
                    const intersection1 = this.ray1.cast();
                    const intersection2 = this.ray2.cast();
                    const intersection3 = this.ray3.cast();
                    const intersection4 = this.ray4.cast();
                    if (intersection1) {
                        intersections.push(intersection1);
                    }
                    if (intersection2) {
                        intersections.push(intersection2);
                    }
                    if (intersection3) {
                        intersections.push(intersection3);
                    }
                    if (intersection4) {
                        intersections.push(intersection4);
                    }
                }

                // Clear the previous graphics
                this.graphics.clear();
                this.overlayGraphics.clear();

                // Draw the viewing cone
                this.graphics.fillStyle(0xffffff, 0.2);
                this.graphics.beginPath();
                this.graphics.moveTo(this.player.x, this.player.y);
                intersections.forEach(intersection => {
                    this.graphics.lineTo(intersection.x, intersection.y);
                });
                this.graphics.closePath();
                this.graphics.fillPath();

                // Draw the overlay
                this.overlayGraphics.fillStyle(0xffffff, 1);
                this.overlayGraphics.fillRect(0, 0, levelWidth * tileSize, levelHeight * tileSize);
                this.overlayGraphics.beginPath();
                this.overlayGraphics.moveTo(this.player.x, this.player.y);
                intersections.forEach(intersection => {
                    this.overlayGraphics.lineTo(intersection.x, intersection.y);
                });
                this.overlayGraphics.closePath();
                this.overlayGraphics.fillPath();
            }

            // Increment the frame counter
            this.frameCounter++;
        }

        const features = ['chest', 'enemies', 'trap'];

        function addFeature(scene, feature, x, y) {
            switch (feature) {
                case 'chest':
                    // Mockup for adding a chest
                    scene.add.rectangle(x * tileSize, y * tileSize, tileSize, tileSize, 0xffd700).setOrigin(0); // Gold color for chest
                    break;
                case 'enemies':
                    // Mockup for adding enemies
                    scene.add.rectangle(x * tileSize, y * tileSize, tileSize, tileSize, 0xff0000).setOrigin(0); // Red color for enemies
                    break;
                case 'trap':
                    // Mockup for adding a trap
                    scene.add.rectangle(x * tileSize, y * tileSize, tileSize, tileSize, 0xcfcfcf).setOrigin(0); // grey color for trap
                    break;
            }
        }

        function generateLevel(scene, seed) {
            // Initialize the seeded random number generator
            Math.seedrandom(seed);

            // Create a 2D array to represent the level
            const level = Array.from({
                length: levelHeight
            }, () => Array(levelWidth).fill(1));

            // Function to create a room
            function createRoom(x, y, width, height, color = normalRoomColor) {
                for (let i = y; i < y + height; i++) {
                    for (let j = x; j < x + width; j++) {
                        level[i][j] = 0;
                    }
                }
                // Draw the room with the specified color
                scene.add.rectangle(x * tileSize, y * tileSize, width * tileSize, height * tileSize, color).setOrigin(0);
                // Mark walls around the room as exposed
                markExposedWalls(x, y, width, height);
            }

            // Function to create a horizontal hallway
            function createHorizontalHallway(x1, x2, y, color = normalRoomColor) {
                for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                    if (level[y][x] !== 0) {
                        level[y][x] = 0;
                        level[y + 1][x] = 0; // Make the hallway two tiles wide
                        scene.add.rectangle(x * tileSize, y * tileSize, tileSize, tileSize, color).setOrigin(0);
                        scene.add.rectangle(x * tileSize, (y + 1) * tileSize, tileSize, tileSize, color).setOrigin(0);
                        // Mark walls around the hallway as exposed
                        markExposedWalls(x, y, 1, 2);
                    }
                }
            }

            // Function to create a vertical hallway
            function createVerticalHallway(y1, y2, x, color = normalRoomColor) {
                for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                    if (level[y][x] !== 0) {
                        level[y][x] = 0;
                        level[y][x + 1] = 0; // Make the hallway two tiles wide
                        scene.add.rectangle(x * tileSize, y * tileSize, tileSize, tileSize, color).setOrigin(0);
                        scene.add.rectangle((x + 1) * tileSize, y * tileSize, tileSize, tileSize, color).setOrigin(0);
                        // Mark walls around the hallway as exposed
                        markExposedWalls(x, y, 2, 1);
                    }
                }
            }

            function markExposedWalls(x, y, width, height) {
                for (let i = y - 1; i <= y + height; i++) {
                    for (let j = x - 1; j <= x + width; j++) {
                        if (i >= 0 && i < levelHeight && j >= 0 && j < levelWidth && level[i][j] === 1) {
                            level[i][j] = 2; // Mark as exposed wall
                        }
                    }
                }
            }

            // Create the starting room (4x4) at the top-left corner
            const startX = 1;
            const startY = 1;
            createRoom(startX, startY, 4, 4);

            // Create rooms
            const rooms = [{
                x: startX,
                y: startY,
                width: 4,
                height: 4
            }];
            for (let i = 0; i < 10; i++) { // Increase the number of rooms
                const roomWidth = Math.floor(Math.random() * 5) + 4;
                const roomHeight = Math.floor(Math.random() * 5) + 4;
                const roomX = Math.floor(Math.random() * (levelWidth - roomWidth - 1)) + 1; // Ensure room fits within borders
                const roomY = Math.floor(Math.random() * (levelHeight - roomHeight - 1)) + 1; // Ensure room fits within borders

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
                        const feature = features[Math.floor(Math.random() * features.length)];
                        addFeature(scene, feature, roomX + Math.floor(roomWidth / 2), roomY + Math.floor(roomHeight / 2));
                    }
                }
            }

            // Designate one room as the exit room, ensuring it is not the starting room
            let exitRoom;
            do {
                exitRoom = rooms[Math.floor(Math.random() * rooms.length)];
            } while (exitRoom.x === startX && exitRoom.y === startY);
            createRoom(exitRoom.x, exitRoom.y, exitRoom.width, exitRoom.height, exitRoomColor); // Dark green color for the exit room

            // Add an exit tile in the exit room
            const exitTileX = exitRoom.x + Math.floor(exitRoom.width / 2);
            const exitTileY = exitRoom.y + Math.floor(exitRoom.height / 2);
            scene.add.rectangle(exitTileX * tileSize, exitTileY * tileSize, tileSize, tileSize, exitTileColor).setOrigin(0); // Blue color for the exit tile

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
                    // if (Math.random() < 0.5) {
                    //     createHorizontalHallway(prevCenterX, currCenterX, prevCenterY, 0x797979);
                    //     createVerticalHallway(prevCenterY, currCenterY, currCenterX - 1, 0x1f1f1f);
                    // } else {
                    createVerticalHallway(prevCenterY - 1, currCenterY + 1, prevCenterX, 0x797979);
                    createHorizontalHallway(prevCenterX, currCenterX + 1, currCenterY, 0x1f1f1f);
                    // }
                } else if (prevCenterX !== currCenterX) {
                    createHorizontalHallway(prevCenterX, currCenterX, prevCenterY, 0x6c8a58);
                } else if (prevCenterY !== currCenterY) {
                    createVerticalHallway(prevCenterY, currCenterY, prevCenterX, 0x6c8a58);
                }
            }

            // Create walls based on the level array
            for (let y = 0; y < levelHeight; y++) {
                for (let x = 0; x < levelWidth; x++) {
                    if (level[y][x] === 1) {
                        const wall = scene.add.image(x * tileSize, y * tileSize, 'wall').setOrigin(0);
                        scene.physics.add.existing(wall, true);
                        scene.walls.add(wall);
                    } else if (level[y][x] === 2) {
                        const wall = scene.add.image(x * tileSize, y * tileSize, 'wall').setOrigin(0);
                        scene.physics.add.existing(wall, true);
                        scene.walls.add(wall);
                        scene.exposedWalls.add(wall); // Add to exposed walls group
                    }
                }
            }

            // Player starting position in the middle of the 4x4 room
            const playerX = (startX + 2) * tileSize;
            const playerY = (startY + 2) * tileSize;

            return {
                x: playerX,
                y: playerY
            };
        }
    </script>
</body>

</html>