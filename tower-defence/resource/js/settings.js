// Initialize the game settings
let health = 250;
const maxHealth = 250;
const columns = 20;
const rows = 10;
let enemyHealth = 100;
let enemySpeed = 0.5;
let selectedTool = 'Path Painter';  // decides the starting tool in editor mode


// Initialize the game variables
let towers = [];
let selectedPath = [];
let selectedWater = [];
let isDragging = false;
let lastTile = null;
let isFirstTile = true;
let enemyFirstCall = true;