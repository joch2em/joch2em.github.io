<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Options - 2D Zombie Game</title>
    <link rel="stylesheet" href="resources/css/menu.css">
</head>
<body>
    <?php
    $settingsJson = file_get_contents('settings.json');
    $settings = json_decode($settingsJson, true);
    $audioVolume = $settings['audio_volume'];
    $controls = $settings['controls'];
    foreach ($controls as $action => $key) {
        if ($key === ' ') {
            $controls[$action] = 'SPACE';
        }
    }
    $difficulty = $settings['difficulty'];
    ?>
    <div class="menu">
        <h1>Options</h1>
        <ul>
            <li>
                <label for="audioVolume">Audio Volume:</label>
                <input type="range" id="audioVolume" name="audioVolume" min="0" max="100" value="<?php echo $audioVolume; ?>">
            </li>
            <li>
                <select name="difficulty" id="difficulty">
                    <option value="easy" <?php if($difficulty == 'easy') echo 'selected'; ?>>Easy</option>
                    <option value="normal" <?php if($difficulty == 'normal') echo 'selected'; ?>>Normal</option>
                    <option value="hard" <?php if($difficulty == 'hard') echo 'selected'; ?>>Hard</option>
                </select>
            </li>
            <li>
                <h2>Controls:</h2>
                <div class="controls-container">
                    <?php foreach ($controls as $action => $key): ?>
                    <div class="control-setting">
                        <span><?php echo ucfirst(str_replace('_', ' ', $action)); ?>:</span>
                        <button class="control-button" data-action="<?php echo $action; ?>"><?php echo strtoupper($key); ?></button>
                    </div>
                    <?php endforeach; ?>
                </div>
            </li>
            <li class="alert"><span id="alert">Saved Settings!</span></li>
            <li><a href="#" onclick="saveSettings()">Save</a></li>
            <li><a href="index.php">Back to Menu</a></li>
        </ul>
    </div>
    <script>
        const controls = <?php echo json_encode($controls); ?>;

        const controlButtons = document.querySelectorAll('.control-button');

        controlButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const originalText = this.textContent;
                this.textContent = 'Press any key...';

                const keyHandler = (event) => {
                    const key = event.key;
                    const disallowedKeys = [
                        'Control', 'Meta', 'Escape',
                        'CapsLock', 'NumLock', 'ScrollLock',
                        'Pause', 'ContextMenu', 'Insert', 'Home',
                        'End', 'PageUp', 'PageDown', 'PrintScreen'
                    ];

                    if (disallowedKeys.includes(key)) {
                        alert('This key cannot be assigned. Please choose another key.');
                        this.textContent = originalText;
                    } else {
                        
                        let existingAction = null;
                        for (const [act, assignedKey] of Object.entries(controls)) {
                            if (assignedKey.toUpperCase() === key.toUpperCase()) {
                                existingAction = act;
                                break;
                            }
                            else if(key === ' ' && assignedKey === 'SPACE'){
                                existingAction = act;
                                break;
                            }
                            else if(key === 'SPACE' && assignedKey === ' '){
                                existingAction = act;
                                break;
                            }
                        }

                        if (existingAction) {
                            controls[existingAction] = controls[action];
                            const existingButton = document.querySelector(`.control-button[data-action="${existingAction}"]`);
                            if (controls[action] === ' ') {
                                existingButton.textContent = 'SPACE';
                            } else {
                                existingButton.textContent = controls[action];
                            }
                        }
                        if(key === ' '){
                            event.preventDefault();
                            this.textContent = "SPACE";
                        }
                        else{
                            this.textContent = key.toUpperCase();
                        }
                        
                        controls[action] = key;
                    }

                    document.removeEventListener('keydown', keyHandler);
                };

                document.addEventListener('keydown', keyHandler);
            });
        });

        function saveSettings(){
            var audioVolume = document.getElementById('audioVolume').value;
            var difficulty = document.getElementById('difficulty').value;
            var settings = <?php echo json_encode($settings); ?>;
            settings.audio_volume = audioVolume;
            settings.difficulty = difficulty;
            settings.controls = controls;
            
            fetch('save_settings.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            }).then(response => {

                alert = document.getElementById('alert');
                alert.style.transition = 'none';

                if (response.ok) {
                    alert.innerHTML = 'Saved Settings!';
                    alert.style.backgroundColor = '#47814f';
                } else {
                    alert.innerHTML = 'Failed To Save Settings!';
                    alert.style.backgroundColor = '#753030';
                }
                alert.style.opacity = '1';

                setTimeout(() => {
                    alert.style.transition = 'opacity 2s';
                    alert.style.opacity = '0';
                }, 500);
            });
        }
    </script>
</body>
</html>