var selected;
var hoverChoice = null;
var inMenu = true;

var typingSpeed = 30;

var playerHitPoints = 92;

var poisonIndex = 0;

var buttonFight = document.getElementById('fight');
var buttonAct = document.getElementById('act');
var buttonItem = document.getElementById('item');
var buttonMercy = document.getElementById('mercy');
var player = document.getElementById('player');
var hitPoints = document.getElementById('hit-points');
var playerHealth = document.getElementById('health');
var playerPoison = document.getElementById('poison');
var menuText = document.getElementById('menuText');
var battleContainer = document.getElementById('battleContainer');
var battleArena = document.getElementById('battleArena');
playerHealth.style.width = 200;

player.style.display = 'none';

buttonFight.addEventListener('click', function() {
    if(inMenu){
        selected = 'fight';
        console.log(selected);
        menuTextAndThings(selected);
        inMenu = false;
    }
});
buttonFight.addEventListener('mouseover', function() {
    if(inMenu){
        hoverChoice = "fight";
        console.log(hoverChoice);
    }
});
buttonAct.addEventListener('click', function() {
    if(inMenu){
        selected = 'act';
        console.log(selected);
        menuTextAndThings(selected);
        inMenu = false;
    }
});
buttonAct.addEventListener('mouseover', function() {
    if(inMenu){
        hoverChoice = "act";
        console.log(hoverChoice);
    }
});
buttonItem.addEventListener('click', function() {
    if(inMenu){
        selected = 'item';
        console.log(selected);
        menuTextAndThings(selected);
        inMenu = false;
    }
});
buttonItem.addEventListener('mouseover', function() { 
    if(inMenu){
        hoverChoice = "item";
        console.log(hoverChoice);
    }
});
buttonMercy.addEventListener('click', function() {
    if(inMenu){
        selected = 'mercy';
        console.log(selected);
        menuTextAndThings(selected);
        inMenu = false;
    }
});
buttonMercy.addEventListener('mouseover', function() {
    if(inMenu){
        hoverChoice = "mercy";
        console.log(hoverChoice);
    }
});

menuInterval = setInterval(function() {
    if(inMenu){
        switch (hoverChoice){
            case "fight":
                buttonFight.classList.add('hover');
                buttonAct.classList.remove('hover');
                buttonItem.classList.remove('hover');
                buttonMercy.classList.remove('hover');
            break;
            case "act":
                buttonAct.classList.add('hover');
                buttonFight.classList.remove('hover');
                buttonItem.classList.remove('hover');
                buttonMercy.classList.remove('hover');
            break;
            case "item":
                buttonItem.classList.add('hover');
                buttonFight.classList.remove('hover');
                buttonAct.classList.remove('hover');
                buttonMercy.classList.remove('hover');
            break;
            case "mercy":
                buttonMercy.classList.add('hover');
                buttonFight.classList.remove('hover');
                buttonAct.classList.remove('hover');
                buttonItem.classList.remove('hover');
            break;
        }
    }
    else{
        buttonFight.classList.remove('hover');
        buttonAct.classList.remove('hover');
        buttonItem.classList.remove('hover');
        buttonMercy.classList.remove('hover');
    }
}, 10);

document.addEventListener('keydown', function(event) {
    if(inMenu){
        try{
            clearInterval(movementInterval);
            movementInterval = null;
        }
        catch(e){
            console.log(e);
        }
        if (event.key === "Enter") {
            inMenu = false;
            selected = hoverChoice;
            console.log(selected);
        }
        if (event.key === "ArrowRight") {
            switch (hoverChoice){
                case null:
                    hoverChoice = "fight";
                    console.log(hoverChoice);
                break;
                case "fight":
                    hoverChoice = "act";
                    console.log(hoverChoice);
                break;
                case "act":
                    hoverChoice = "item";
                    console.log(hoverChoice);
                break;
                case "item":
                    hoverChoice = "mercy";
                    console.log(hoverChoice);
                break;
                case "mercy":
                    hoverChoice = "fight";
                    console.log(hoverChoice);
                break;
            }
        }
        if (event.key === "ArrowLeft") {
            switch (hoverChoice){
                case null:
                    hoverChoice = "fight";
                    console.log(hoverChoice);
                break;
                case "fight":
                    hoverChoice = "mercy";
                break;
                case "act":
                    hoverChoice = "fight";
                break;
                case "item":
                    hoverChoice = "act";
                break;
                case "mercy":
                    hoverChoice = "item";
                break;
            }
        }
    }
});

// Function to show text letter by letter
function typeWriter(text, index = 0) {
    if(inMenu){
        if (index === 0) {
            menuText.innerHTML = ''; // Clear the text before starting
        }
        if (index < text.length) {
            menuText.innerHTML += text.charAt(index);
            
            // Delay the next call to typeWriter
            setTimeout(() => {
                typeWriter(text, index + 1); // Call recursively with updated index
            }, typingSpeed);
        }
    }
}

function menuTextAndThings(menuChoice)
{
    switch(menuChoice)
    {
        case "fight":
            try{
                startFight(selected);
            }
            catch(e){
                console.log(e);
            }
        break;
        case "act":
            try{
                startFight(selected);
            }
            catch(e){
                console.log(e);
            }
        break;
        case "item":
            try{
                startFight(selected);
            }
            catch(e){
                console.log(e);
            }
        break;
        case "mercy":
            try{
                startFight(selected);
            }
            catch(e){
                console.log(e);
            }
        break;
    }
    typeWriter("");
    player.style.display = 'block';
}

function damagePlayer(damage, poison){
    if(poison){
        var poisonInterval = setInterval(() => {
            damagePlayer(1, false);
            poisonIndex++;
            if(poisonIndex >= 10){
                clearInterval(poisonInterval);
                poisonIndex = 0;
            }
        }, 300)
    }
    playerHitPoints -= damage;
    playerHealth.style.width = playerHealth.style.width.match(/[0-9]+/)[0] - (damage / 92) * 190;
    hitPoints.innerHTML = Math.max(playerHitPoints, 0)+"/92"
    if(playerHitPoints == 0){
        setInterval(() => {
            playerHealth.style.width + 1;

        }, 100)
    }
    // playerPoison.style.width = playerHitPoints;
}