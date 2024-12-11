class RockThrowerTower {
    constructor(x, y) {
        this.type = 'rockThrower';
        this.damage = 1;
        this.range = 3;
        this.speed = 1;
        this.x = x;
        this.y = y;
    }
}


function makeTower(x, y, towerType) {
    switch (towerType) {
        case 'rockThrower':
            return new RockThrowerTower(x, y);
        case 'fast':
            return null;
        case 'strong':
            return null;
        default:
            throw new Error(`Unknown tower type: ${towerType}`);
    }
}