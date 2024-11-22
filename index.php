<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Games</title>
    <link rel="stylesheet" href="css/index.css">
</head>

<body>
    <h1>My shitty unfinished projects</h1>
    <div>

        <?php
        $excludedFiles = ["index", "resources", "css", "moving-button.html"];

        foreach (scandir(".") as $file) {
            if (!in_array($file, $excludedFiles) && $file !== "." && $file !== "..") {
                if (is_dir($file)) {
                    $displayName = ucfirst(str_replace('-', ' ', $file));
                    $words = explode(' ', $displayName);
                    if (count($words) > 1) {
                        $words[1] = ucfirst($words[1]);
                    }
                    $displayName = implode(' ', $words);
                    if ($file == "heart-fights") {
                        echo "<div class='heart_fights_container'><img src='resources/heart.png' alt='*' class='heart'><a href='$file/' class='heart_fights'>$displayName</a><img src='resources/heart.png' alt='*' class='heart'></div>";
                    } elseif ($file == "2D-zombies") {
                        echo "<div class='heart_fights_container'><img src='resources/zombie.png' alt='*' class='heart'><a href='$file/' class='heart_fights'>$displayName</a><img src='resources/zombie.png' alt='*' class='heart'></div>";
                    } elseif ($file == "rogue-light") {
                        echo "<div class='heart_fights_container'><img src='resources/cross_holy.png' alt='*' class='heart'><a href='$file/' class='heart_fights'>$displayName</a><img src='resources/cross_holy.png' alt='*' class='heart'></div>";
                    } elseif ($file == "shrub-dubs") {
                        echo "<div class='heart_fights_container'><img src='resources/bush.png' alt='*' class='heart'><a href='$file/' class='heart_fights'>$displayName</a><img src='resources/bush.png' alt='*' class='heart'></div>";
                    } else {
                        echo "<a href='$file/'>$displayName</a>";
                    }
                } elseif (pathinfo($file, PATHINFO_EXTENSION) === 'html') {
                    $displayName = ucfirst(str_replace('-', ' ', pathinfo($file, PATHINFO_FILENAME)));
                    $words = explode(' ', $displayName);
                    if (count($words) > 1) {
                        $words[1] = ucfirst($words[1]);
                    }
                    $displayName = implode(' ', $words);
                    if ($file == "meteors.html") {
                        echo "<div class='heart_fights_container'><img src='resources/meteor.png' alt='*' class='heart'><a href='$file/' class='heart_fights'>$displayName</a><img src='resources/meteor.png' alt='*' class='heart'></div>";
                    } elseif ($file == "button.html") {
                        echo "<div class='heart_fights_container'><div class='button-base'><div class='the-button'></div></div>       <a href='$file'>$displayName</a>       <div class='button-base'><div class='the-button'></div></div></div>";
                    } else {
                        echo "<a href='$file'>$displayName</a>";
                    };
                }
            }
        }
        ?>
</body>

</html>