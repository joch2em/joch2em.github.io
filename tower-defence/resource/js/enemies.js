class Enemy {
    constructor(health, speed, path) {
        console.log('Creating enemy with health:', health, 'speed:', speed);
        this.health = health;
        this.speed = speed;
        this.path = path;
        this.position = 0; // Index in the path array
        this.enemyFirstCall = true;
        this.element = this.createElement();
        this.move();
    }

    createElement() {
        const enemyDiv = document.createElement('div');
        enemyDiv.classList.add('enemy');
        document.getElementById('gameGrid').appendChild(enemyDiv);
        return enemyDiv;
    }

    move() {
        console.log('Moving enemy!');
        if (this.position < this.path.length) {
            const coord = this.path[this.position];
            const tile = document.getElementById('gameGrid').children[coord.y * 20 + coord.x];
            const rect = tile.getBoundingClientRect();
            this.element.style.transition = `left ${this.speed}s linear, top ${this.speed}s linear`;
            this.element.style.left = `${rect.left + window.scrollX + rect.width / 2 - this.element.offsetWidth / 2}px`;
            this.element.style.top = `${rect.top + window.scrollY + rect.height / 2 - this.element.offsetHeight / 2}px`;
            this.position++;
            if (this.enemyFirstCall) {
                this.enemyFirstCall = false;
                this.move();
                return;
            }
            setTimeout(() => this.move(), this.speed * 1000);
        } else {
            // Enemy reached the end of the path
            this.element.remove();
        }
    }
}

function spawnEnemy(path) {
    console.log('Spawning enemy with path:', path);
    new Enemy(enemyHealth, enemySpeed, path);
}