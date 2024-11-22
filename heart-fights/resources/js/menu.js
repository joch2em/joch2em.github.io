var menuMusic = new Audio("resources/audio/menuMusic.mp3");
var selected = new Audio("resources/audio/savepoint.mp3");
menuMusic.loop = true;
menuMusic.volume = 0.2;
menuMusic.play()

var heartContainer = document.getElementsByClassName("heart-container")[0];
var test = document.getElementById("test");

var bones = document.getElementById("bones");
var fishy = document.getElementById("fishy");

var bonesFight;
var somethingSelected = false;

let scaleUp = true;

bones.addEventListener("click", function() {
    if(!somethingSelected){
        selected.play();
        menuMusic.pause();
        somethingSelected = true;
        var flashing = setInterval(() => {
            bones.style.color = bones.style.color == "blue" ? "white" : "blue";
        }, 300); 
        setTimeout(() => {
            clearInterval(flashing);
            bonesFight = window.open("fights/boneyMan.php", "", "width=1000,height=1000");
        }, 3000);
    }
});

fishy.addEventListener("click", function() {
    if(!somethingSelected){
        selected.play();
        menuMusic.pause();
        somethingSelected = true;
        var flashing = setInterval(() => {
            fishy.style.color = fishy.style.color == "green" ? "white" : "green";
        }, 300); 
        setTimeout(() => {
            clearInterval(flashing);
            fishyFight = window.open("fights/fishyWoman.php", "", "width=1000,height=1000");
        }, 3000);
    }
});

heartContainer.addEventListener("click", function() {
    if(!somethingSelected){
        somethingSelected = true;
        makePixelsFall();
        menuMusic.pause();
        setTimeout(() => {
            selected.play();
        }, 5000)
        setTimeout(() => {
            secretHeart = window.open("secrets/heart.php", "", "width=1000,height=1000");;
        }, 6000);
    }
});



var breathing = setInterval(() => {
    if (scaleUp) {
        heartContainer.style.transform = 'scale(1.0)';
    } else {
        heartContainer.style.transform = 'scale(0.8)';
    }
    scaleUp = !scaleUp;
  }, 2000); // Interval of 1 second

document.addEventListener('DOMContentLoaded', function() {
    heartContainer.style.transform = 'scale(0.8)';
});

function makePixelsFall() {
    // Select all the pixel elements in the container
    const pixels = Array.from(document.querySelectorAll('.pixel'));
    let remainingPixels = [...pixels]; // Create a copy of the pixel array

    function fallNextPixel() {
        if (remainingPixels.length === 0) return; // Stop when all pixels have fallen

        // Randomly pick a pixel from the remaining pixels
        const randomIndex = Math.floor(Math.random() * remainingPixels.length);
        const pixelToFall = remainingPixels[randomIndex];

        // Remove the selected pixel from the remainingPixels array
        remainingPixels.splice(randomIndex, 1);

        // Apply the fall class to the selected pixel
        pixelToFall.classList.add('fall');

        // Continue to the next pixel after a short delay
        setTimeout(fallNextPixel, 20); // Adjust delay to control fall speed
    }

    // Start the falling process
    fallNextPixel();
}