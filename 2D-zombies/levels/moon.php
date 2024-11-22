<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moon</title>
    <link rel="stylesheet" href="../resources/css/level.css">
</head>
<body>
    <div class="game-container">
        <h1 color="white">Moon</h1>
        <span id="ammo">Ammo: 0</span>
        <canvas id="cameraCanvas" width="800px" height="400px" style="border:1px solid #ffffff;"></canvas>
        <canvas id="moon" width="1000" height="2000"></canvas>
        <button id="spawnEnemyButton">Spawn Enemy</button>
    </div>
    <script>
        <?php
        $settingsJson = file_get_contents('../settings.json');
        $settings = json_decode($settingsJson, true);
        ?>
        const settings = <?php echo json_encode($settings); ?>;
        let volume;
        let controls;
        let difficulty;
        try{
            volume = settings.volume;
            controls = settings.controls;
            difficulty = settings.difficulty;
        }
        catch(e){
            volume = 80;
            controls = {
                move_left: 'a',
                move_right: 'd',
                move_up: 'w',
                move_down: 's',
                shoot: ' ',
                reload: 'R'
            };
            difficulty = 'normal';
            console.log('Settings not found, using default settings');
        }
    </script>
    <script src="../resources/js/moon/pathfinding.js"></script>
    <script src="../resources/js/moon/movement.js"></script>
    <script src="../resources/js/moon/player.js"></script>
</body>
</html>