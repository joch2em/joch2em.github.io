var movementInterval = null;
let movingDirection = { left: false, right: false, up: false, down: false };

setTimeout(() => {
    typeWriter("You encountered a boney man?!");
}, 500);

// Function to start movement
function startMoving() {
    if (movementInterval) return; // Prevent multiple intervals

    movementInterval = setInterval(function() {
        let player = document.getElementById('player');
        let currentLeft = parseInt(getComputedStyle(player).left);
        let currentTop = parseInt(getComputedStyle(player).top);
        let playerSpeed = 5;
        let diagonalSpeed = playerSpeed / Math.sqrt(2); // Adjust speed when moving diagonally

        // Check if both horizontal and vertical keys are pressed
        let isDiagonal = (movingDirection.left || movingDirection.right) && (movingDirection.up || movingDirection.down);

        // Check all directions and adjust position
        if (movingDirection.left) {
            player.style.left = Math.max(0, currentLeft - (isDiagonal ? diagonalSpeed : playerSpeed)) + "px"; // Move left
        }
        if (movingDirection.right) {
            player.style.left = Math.min(674 - parseInt(getComputedStyle(player).width), currentLeft + (isDiagonal ? diagonalSpeed : playerSpeed)) + "px"; // Move right
        }
        if (movingDirection.up) {
            player.style.top = Math.max(0, currentTop - (isDiagonal ? diagonalSpeed : playerSpeed)) + "px"; // Move up
        }
        if (movingDirection.down) {
            player.style.top = Math.min(200 - parseInt(getComputedStyle(player).height), currentTop + (isDiagonal ? diagonalSpeed : playerSpeed)) + "px"; // Move down
        }
    }, 20); // Update movement every 20ms (adjust speed here if needed)
}

// Function to stop the interval when no keys are pressed
function stopMovingIfNoKeys() {
    if (!movingDirection.left && !movingDirection.right && !movingDirection.up && !movingDirection.down) {
        clearInterval(movementInterval);
        movementInterval = null;
    }
}

document.addEventListener('keyup', function(event) {
    if(!inMenu){
        switch(event.key){
            case "ArrowLeft": 
                movingDirection.left = false;
                break;
            case "ArrowRight": 
                movingDirection.right = false;
                break;
            case "ArrowUp": 
                movingDirection.up = false;
                break;
            case "ArrowDown": 
                movingDirection.down = false;
                break;
        }
        stopMovingIfNoKeys(); // Stop the movement if no keys are active
    }
});

document.addEventListener('keydown', function(event) {
    if(!inMenu){
        switch(event.key){
            case "ArrowLeft": 
                movingDirection.left = true;
                startMoving();
                break;
            case "ArrowRight": 
                movingDirection.right = true;
                startMoving();
                break;
            case "ArrowUp": 
                movingDirection.up = true;
                startMoving();
                break;
            case "ArrowDown": 
                movingDirection.down = true;
                startMoving();
                break;
        }
    }
});