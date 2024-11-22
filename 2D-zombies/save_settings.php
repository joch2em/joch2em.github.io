<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $settings = json_decode(file_get_contents('php://input'), true);
    file_put_contents('settings.json', json_encode($settings, JSON_PRETTY_PRINT));
}
?>