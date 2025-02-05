let touchSpawnCount = 0;
let foodEatenCount = 0;
let deathCount = 0;
let nextFoodSpawnTime = Math.random() * 5000 + 25000;
let longestLivingCircle = null;
let longestLivingTime = 0;
let longestLivingInterval = null;
let frameCount = 0;

document.querySelector('.buttons button').addEventListener('click', () => {
    addLife();
});

document.querySelector('.buttons .spawn-food').addEventListener('click', () => {
    spawnFood(true);
});

function updateCounters() {
    document.querySelector('.food-eaten-counter').textContent = `Food eaten: ${foodEatenCount}`;
    document.querySelector('.death-counter').textContent = `Deaths: ${deathCount}`;
    document.querySelector('.next-food-counter').textContent = `Next food in: ${Math.ceil(nextFoodSpawnTime / 1000)}s`;
}

function addLife(size = 20, left = Math.random() * 90, top = Math.random() * 90, isTouchSpawn = false) {
    if (isTouchSpawn) {
        touchSpawnCount++;
        document.querySelector('.counter').textContent = `Circles born: ${touchSpawnCount}`;
    }
    console.log(`Adding life: size=${size}, left=${left}, top=${top}`);
    const field = document.querySelector('.field');
    const circle = document.createElement('div');
    circle.classList.add('life');
    circle.style.left = `${left}%`;
    circle.style.top = `${top}%`;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.dataset.birthTime = Date.now();
    circle.dataset.isParent = 'false';
    if (isTouchSpawn) {
        circle.style.backgroundColor = 'red'; // New spawns are red
    }
    field.appendChild(circle);
    moveRandomly(circle);
    if (size < 20) {
        circle.dataset.growing = 'true';
        addGrowProgressBar(circle);
        grow(circle);
    }
    if (size === 20) {
        addFoodProgressBar(circle);
        startFoodTimer(circle);
    }
    updateLongestLivingCircle();
    return circle; // Return the created circle
}

function addGrowProgressBar(element) {
    let progressContainer = element.querySelector('.progress-container');
    if (!progressContainer) {
        progressContainer = document.createElement('div');
        progressContainer.classList.add('progress-container');
        element.appendChild(progressContainer);
    }

    const growBarBackground = document.createElement('div');
    growBarBackground.classList.add('progress-bar-background');

    const growBar = document.createElement('div');
    growBar.classList.add('progress-bar', 'grow-bar');
    growBar.style.width = '0%';

    growBarBackground.appendChild(growBar);
    progressContainer.appendChild(growBarBackground);
}

function grow(element) {
    const growStep = () => {
        const currentSize = parseFloat(element.style.width);
        if (currentSize < 20) {
            const newSize = currentSize + 0.0667; // Grow to 20px over 5 minutes (300 seconds)
            element.style.width = `${newSize}px`;
            element.style.height = `${newSize}px`;
            const growBar = element.querySelector('.grow-bar');
            if (growBar) {
                growBar.style.width = `${((newSize - 5) / 15) * 100}%`;
            }
            setTimeout(growStep, 1000);
        } else {
            element.style.width = '20px';
            console.log('Growth complete');
            delete element.dataset.growing;
            element.style.backgroundColor = 'crimson'; // Turn crimson when done growing
            const growBar = element.querySelector('.grow-bar');
            growBar.remove(); // Remove the grow bar
            
            addFoodProgressBar(element);
            startFoodTimer(element);
        }
    };
    growStep();
}

function moveRandomly(element) {
    const move = () => {
        if (Math.random() < 0.70) { // 70% chance to stand still
            setTimeout(move, 500);
            return;
        }

        const left = parseFloat(element.style.left);
        const top = parseFloat(element.style.top);

        let newLeft, newTop;

        if (Math.random() < 0.4) { // 40% chance to move towards another circle
            let target = null;
            if (element.dataset.isParent === 'true') {
                const circles = document.querySelectorAll('.life');
                circles.forEach(circle => {
                    if (circle !== element && (circle.dataset.isParent === 'true' || circle.dataset.isChild === 'true')) {
                        target = circle;
                    }
                });
            } else {
                const circles = document.querySelectorAll('.life');
                if (circles.length > 1) {
                    target = circles[Math.floor(Math.random() * circles.length)];
                    if (target === element) {
                        target = null;
                    }
                }
            }
            if (target) {
                const targetLeft = parseFloat(target.style.left);
                const targetTop = parseFloat(target.style.top);
                newLeft = left + (targetLeft - left) * 0.1;
                newTop = top + (targetTop - top) * 0.1;
            }
        }

        if (newLeft === undefined || newTop === undefined) {
            newLeft = Math.max(0, Math.min(90, left + (Math.random() - 0.5) * 10));
            newTop = Math.max(0, Math.min(90, top + (Math.random() - 0.5) * 10));
        }

        element.style.transition = 'all 1s linear';
        element.style.left = `${newLeft}%`;
        element.style.top = `${newTop}%`;
        checkFoodCollision(element);
        setTimeout(move, 1000);
    };
    move();
}

function startCooldown(element) {
    element.dataset.cooldown = 'true';
    let progressContainer = element.querySelector('.progress-container');
    if (!progressContainer) {
        progressContainer = document.createElement('div');
        progressContainer.classList.add('progress-container');
        element.appendChild(progressContainer);
    }

    let cooldownBarBackground = element.querySelector('.cooldown-bar-background');
    if (!cooldownBarBackground) {
        cooldownBarBackground = document.createElement('div');
        cooldownBarBackground.classList.add('progress-bar-background', 'cooldown-bar-background');
        progressContainer.appendChild(cooldownBarBackground);
    }

    const cooldownBar = document.createElement('div');
    cooldownBar.classList.add('progress-bar', 'cooldown-bar');
    cooldownBar.style.width = '100%';

    cooldownBarBackground.appendChild(cooldownBar);

    let cooldownTime = 300; // 60 seconds cooldown
    const cooldownStep = () => {
        cooldownTime--;
        cooldownBar.style.width = `${(cooldownTime / 300) * 100}%`;
        if (cooldownTime > 0) {
            setTimeout(cooldownStep, 1000);
        } else {
            delete element.dataset.isParent;
            delete element.dataset.cooldown;
            cooldownBarBackground.remove();
        }  
    };
    cooldownStep();
}

function checkCollisions() {
    frameCount++;
    if (frameCount % 10 !== 0) {
        requestAnimationFrame(checkCollisions);
        return;
    }

    const circles = document.querySelectorAll('.life');
    const foods = document.querySelectorAll('.food');
    
    circles.forEach((circle1, index) => {
        for (let i = index + 1; i < circles.length; i++) {
            const circle2 = circles[i];
            const rect1 = circle1.getBoundingClientRect();
            const rect2 = circle2.getBoundingClientRect();
            const overlap = !(rect1.right < rect2.left || 
                             rect1.left > rect2.right || 
                             rect1.bottom < rect2.top || 
                             rect1.top > rect2.bottom);
            if (overlap) {
                const circle1FoodTime = parseInt(circle1.dataset.foodTime, 10);
                const circle2FoodTime = parseInt(circle2.dataset.foodTime, 10);
                if (parseFloat(circle1.style.width) === 20 && parseFloat(circle2.style.width) === 20 && 
                    !circle1.dataset.growing && !circle2.dataset.growing && 
                    !circle1.dataset.cooldown && !circle2.dataset.cooldown &&
                    circle1FoodTime > 40 && circle2FoodTime > 40) {
                    const child = addLife(5, parseFloat(circle2.style.left), parseFloat(circle2.style.top), true); // Create a new small circle at the same location as one of the touching circles
                    circle1.dataset.isParent = 'true';
                    circle2.dataset.isParent = 'true';
                    child.dataset.isChild = 'true';
                    startCooldown(circle1);
                    startCooldown(circle2);
                }
            }
        }

        // Check for food collision
        const circleRect = circle1.getBoundingClientRect();
        foods.forEach(food => {
            const foodRect = food.getBoundingClientRect();
            const overlap = !(circleRect.right < foodRect.left || 
                             circleRect.left > foodRect.right || 
                             circleRect.bottom < foodRect.top || 
                             circleRect.top > foodRect.bottom);
            if (overlap) {
                food.remove();
                foodEatenCount++;
                updateCounters();
                const foodBar = circle1.querySelector('.food-bar');
                if (foodBar) {
                    foodBar.style.width = '100%';
                    circle1.dataset.foodTime = 120; // Reset the food timer
                }
            }
        });
    });
    requestAnimationFrame(checkCollisions);
}

function spawnFood(manualSpawn = false) {
    const field = document.querySelector('.field');
    const food = document.createElement('div');
    food.classList.add('food');
    let left, top, overlap;

    do {
        left = Math.random() * 90;
        top = Math.random() * 90;
        overlap = false;
        const circles = document.querySelectorAll('.life');
        circles.forEach(circle => {
            const rect1 = circle.getBoundingClientRect();
            const rect2 = {
                left: left * field.clientWidth / 100,
                top: top * field.clientHeight / 100,
                right: (left + 10) * field.clientWidth / 100,
                bottom: (top + 10) * field.clientHeight / 100
            };
            if (!(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom)) {
                overlap = true;
            }
        });
    } while (overlap);

    food.style.left = `${left}%`;
    food.style.top = `${top}%`;
    food.style.width = '10px';
    food.style.height = '10px';
    field.appendChild(food);

    if (!manualSpawn) {
        nextFoodSpawnTime = Math.random() * 5000 + 25000;
        updateCounters();
    }
}

setInterval(() => {
    spawnFood();
}, nextFoodSpawnTime);

setInterval(() => {
    nextFoodSpawnTime -= 1000;
    updateCounters();
}, 1000);

requestAnimationFrame(checkCollisions);

function addFoodProgressBar(element) {
    let progressContainer = element.querySelector('.progress-container');
    if (!progressContainer) {
        progressContainer = document.createElement('div');
        progressContainer.classList.add('progress-container');
        element.appendChild(progressContainer);
    }

    const foodBarBackground = document.createElement('div');
    foodBarBackground.classList.add('progress-bar-background');

    const foodBar = document.createElement('div');
    foodBar.classList.add('progress-bar', 'food-bar');
    foodBar.style.width = '100%';

    foodBarBackground.appendChild(foodBar);
    progressContainer.appendChild(foodBarBackground);
}

function startFoodTimer(element) {
    element.dataset.foodTimer = 'true';
    element.dataset.foodTime = 120; // 2 minutes
    const foodBar = element.querySelector('.food-bar');

    const foodStep = () => {
        let foodTime = parseInt(element.dataset.foodTime, 10);
        foodTime--;
        element.dataset.foodTime = foodTime;
        foodBar.style.width = `${(foodTime / 120) * 100}%`;
        if (foodTime > 0) {
            if (foodTime <= 20) {
                moveToNearestFood(element);
            }
            setTimeout(foodStep, 1000);
        } else {
            element.remove();
            deathCount++;
            updateCounters();
            if (element === longestLivingCircle) {
                longestLivingCircle = null;
                longestLivingTime = 0;
                document.querySelector('.longest-living-time').textContent = `Longest surviving: 0s`;
            }
            updateLongestLivingCircle();
        }
    };
    foodStep();
}

function moveToNearestFood(element) {
    const foods = document.querySelectorAll('.food');
    if (foods.length === 0) return;

    const elementRect = element.getBoundingClientRect();
    const foodDistances = [];

    foods.forEach(food => {
        const foodRect = food.getBoundingClientRect();
        const distance = Math.hypot(foodRect.left - elementRect.left, foodRect.top - elementRect.top);
        foodDistances.push({ food, distance });
    });

    foodDistances.sort((a, b) => a.distance - b.distance);

    const closestFoods = foodDistances.slice(0, 5);
    const targetFood = closestFoods[Math.floor(Math.random() * closestFoods.length)].food;

    if (targetFood) {
        const foodRect = targetFood.getBoundingClientRect();
        const fieldRect = document.querySelector('.field').getBoundingClientRect();
        const newLeft = ((foodRect.left - fieldRect.left) / fieldRect.width) * 100;
        const newTop = ((foodRect.top - fieldRect.top) / fieldRect.height) * 100;

        element.style.transition = 'all 1s linear';
        element.style.left = `${newLeft}%`;
        element.style.top = `${newTop}%`;
    }
}

function checkFoodCollision(element) {
    const foods = document.querySelectorAll('.food');
    const elementRect = element.getBoundingClientRect();

    foods.forEach(food => {
        const foodRect = food.getBoundingClientRect();
        const overlap = !(elementRect.right < foodRect.left || 
                         elementRect.left > foodRect.right || 
                         elementRect.bottom < foodRect.top || 
                         elementRect.top > foodRect.bottom);
        if (overlap) {
            food.remove();
            const foodBar = element.querySelector('.food-bar');
            if (foodBar) {
                foodBar.style.width = '100%';
            }
        }
    });
}

function updateLongestLivingCircle() {
    if (longestLivingCircle) {
        longestLivingCircle.querySelector('.crown').remove();
    }

    const circles = document.querySelectorAll('.life');
    let maxTime = 0;
    circles.forEach(circle => {
        const birthTime = parseInt(circle.dataset.birthTime, 10);
        const aliveTime = Date.now() - birthTime;
        if (aliveTime > maxTime) {
            maxTime = aliveTime;
            longestLivingCircle = circle;
        }
    });

    if (longestLivingCircle) {
        const crown = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        crown.setAttribute("class", "crown");
        crown.setAttribute("width", "16");
        crown.setAttribute("height", "16");
        crown.setAttribute("viewBox", "0 0 24 24");
        crown.innerHTML = '<path d="M12 2l3 7h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z"/>';
        longestLivingCircle.appendChild(crown);
    }

    longestLivingTime = maxTime;
    document.querySelector('.longest-living-time').textContent = `Longest surviving: ${Math.floor(longestLivingTime / 1000)}s`;
}

setInterval(() => {
    if (longestLivingCircle) {
        const birthTime = parseInt(longestLivingCircle.dataset.birthTime, 10);
        longestLivingTime = Date.now() - birthTime;
        document.querySelector('.longest-living-time').textContent = `Longest surviving: ${Math.floor(longestLivingTime / 1000)}s`;
    }
}, 1000);
