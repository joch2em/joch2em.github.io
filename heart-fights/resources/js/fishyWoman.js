setTimeout(() => {
    typeWriter("You encountered a fishy woman?!");
}, 500);
var shieldTop = document.getElementById('shield-top');
var shieldBottom = document.getElementById('shield-bottom');
var shieldLeft = document.getElementById('shield-left');
var shieldRight = document.getElementById('shield-right');
var spawnLeft = document.getElementById('spawnLeft');
var spawnRight = document.getElementById('spawnRight');
var spawnTop = document.getElementById('spawnTop');
var spawnBottom = document.getElementById('spawnBottom');
var shieldSide = "top";
var spearCounter = 0;
var randomSide = "top";

function startFight() {
    typeWriter("");
    battleArena.style.width = 100;
    battleArena.style.height = 100;
    shieldTop.style.display = 'block';
    // setInterval(() => {
    //     setTimeout(() => {
    //         shootSpear("top", 5);
    //     }, 300);
    //     setTimeout(() => {
    //         shootSpear("left", 5);
    //     }, 600);
    //     setTimeout(() => {
    //         shootSpear("left", 5);
    //     }, 900);
    //     setTimeout(() => {
    //         shootSpear("left", 5);
    //     }, 1200);
    //     setTimeout(() => {
    //         shootSpear("right", 5);
    //     }, 1500);
    //     setTimeout(() => {
    //         shootSpear("top", 5);
    //     }, 1800);
    //     setTimeout(() => {
    //         shootSpear("top", 5);
    //     }, 2100);
    //     setTimeout(() => {
    //         shootSpear("bottom", 5);
    //     }, 2400);
    //     setTimeout(() => {
    //         shootSpear("right", 5);
    //     }, 2700);
    // }, 5000);
}

function setShieldSide(side){
    switch(side){
        case "top":
            shieldTop.style.display = 'block';
            shieldBottom.style.display = 'none';
            shieldLeft.style.display = 'none';
            shieldRight.style.display = 'none';
            shieldSide = "top";
            break;
        case "bottom":
            shieldBottom.style.display = 'block';
            shieldTop.style.display = 'none';
            shieldLeft.style.display = 'none';
            shieldRight.style.display = 'none';
            shieldSide = "bottom";
            break;
        case "left":
            shieldLeft.style.display = 'block';
            shieldTop.style.display = 'none';
            shieldBottom.style.display = 'none';
            shieldRight.style.display = 'none';
            shieldSide = "left";
            break;
        case "right":
            shieldRight.style.display = 'block';
            shieldTop.style.display = 'none';
            shieldBottom.style.display = 'none';
            shieldLeft.style.display = 'none';
            shieldSide = "right";
            break;
    }
}

function getRandomSide(){
    var sides = ["top", "bottom", "left", "right"];
    return sides[Math.floor(Math.random() * sides.length)];
}

setTimeout(() => {
    console.log("------------------------");
    console.log(getRandomSide());
    console.log("------------------------");
}, 3000);

function shootSpear(side, speed){
    if(inMenu) return;
    switch(side){
        case "top":
            var spear = document.createElement("div");
            spear.classList.add("spear");
            spawnTop.appendChild(spear);
            spear.style.top = '0px';
            var spearIntervalName = 'spearInterval' + spearCounter;
            spearCounter++;
            window[spearIntervalName] = setInterval(function(){
                spear.style.top = (parseInt(spear.style.top) + 2) + 'px';
                console.log(spear.getBoundingClientRect());
                if (spear.getBoundingClientRect().bottom >= shieldTop.getBoundingClientRect().top && shieldSide == "top") {
                    spear.remove();
                    clearInterval(window[spearIntervalName]);
                }
            }, speed);
            break;
        case "bottom":
            var spear = document.createElement("div");
            spear.classList.add("spear");
            spawnBottom.appendChild(spear);
            spear.style.bottom = '0px';
            var spearIntervalName = 'spearInterval' + spearCounter;
            spearCounter++;
            window[spearIntervalName] = setInterval(function(){
                spear.style.bottom = (parseInt(spear.style.bottom) + 2) + 'px';
                console.log(spear.getBoundingClientRect());
                if (spear.getBoundingClientRect().top >= shieldBottom.getBoundingClientRect().bottom && shieldSide == "bottom") {
                    spear.remove();
                    clearInterval(window[spearIntervalName]);
                }
            }, speed);
            break;
        case "left":
            var spear = document.createElement("div");
            spear.classList.add("spear");
            spawnLeft.appendChild(spear);
            spear.style.left = '0px';
            var spearIntervalName = 'spearInterval' + spearCounter;
            spearCounter++;
            window[spearIntervalName] = setInterval(function(){
                spear.style.left = (parseInt(spear.style.left) + 2) + 'px';
                // console.log(spear.getBoundingClientRect());
                if (spear.getBoundingClientRect().right >= shieldLeft.getBoundingClientRect().left && shieldSide == "left") {
                    spear.remove();
                    clearInterval(window[spearIntervalName]);
                    spearInterval = null;
                }
            }, speed);
            break;
        case "right":
            var spear = document.createElement("div");
            spear.classList.add("spear");
            spawnRight.appendChild(spear);
            spear.style.right = '0px';
            var spearIntervalName = 'spearInterval' + spearCounter;
            spearCounter++;
            window[spearIntervalName] = setInterval(function(){
                spear.style.right = (parseInt(spear.style.right) + 2) + 'px';
                console.log(spear.getBoundingClientRect());
                if (spear.getBoundingClientRect().left >= shieldRight.getBoundingClientRect().right && shieldSide == "right") {
                    spear.remove();
                    clearInterval(window[spearIntervalName]);
                    spearInterval = null;
                }
            }, speed);
            break;
    }
}


addEventListener('keydown', function(event) {
    if(!inMenu){
        switch(event.key){
            case "ArrowLeft": 
                setShieldSide("left");
                break;
            case "ArrowRight": 
                setShieldSide("right");
                break;
            case "ArrowUp": 
                setShieldSide("top");
                break;
            case "ArrowDown": 
                setShieldSide("bottom");
                break;
        }
    }
});