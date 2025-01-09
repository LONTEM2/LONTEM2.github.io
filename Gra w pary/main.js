console.log("test");
setIdToTiles();
var tilesPlacement = getRandomPlacement();
let validTiles = [];
let isFirstClicked = false;
let lock = false;
let firstTileId;
let secondTileId;
let gameFinished = false; // Zmienna do sprawdzania, czy gra zakończona

window.onload = function() {
    startGameTimer(); // Timer zaczyna działać po załadowaniu strony
};

function setIdToTiles() {
    let items = document.getElementsByTagName("td");
    let id = 0;
    Array.from(items).forEach(item => {
        item.id = id;
        id++;
    });
}

function getRandomPlacement() {
    let array = [];
    let numToChoose = [];
    for (let i = 1; i <= 32; i++) {
        numToChoose.push(i);
        numToChoose.push(i);
    }
    for (let i = 0; i < 64; i++) {
        let chosenNum = getRandomInt(0, numToChoose.length);
        array[i] = numToChoose[chosenNum];
        numToChoose.splice(chosenNum, 1);
    }
    return array;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function tileClick(tile) {
    if (lock || gameFinished) { // Blokada kliknięć, gdy gra się skończy
        return;
    }
    if (validTiles.includes(tile.id)) {
        return;
    }
    if (firstTileId == tile.id) {
        return;
    }
    tile.classList.add("tileClicked");
    createImgSrc(tile, parseInt(tile.id));
    if (isFirstClicked) {
        secondTileId = tile.id;
        blockAndCheck();
        isFirstClicked = false;
        ClickMusic();
    } else {
        ClickMusic();
        firstTileId = tile.id;
        isFirstClicked = true;
    }
}

function createImgSrc(ele, num) {
    let img = document.createElement("img");
    img.src = "icons/" + tilesPlacement[num] + ".png";
    img.style.height = "60px";
    ele.appendChild(img);
}

function blockAndCheck() {
    lock = true;
    setTimeout(function () {
        verifyTiles();
        lock = false;
        firstTileId = null;
        secondTileId = null;
    }, 500);
}

function verifyTiles() {
    let firstEle = document.getElementById(firstTileId);
    let secondEle = document.getElementById(secondTileId);
    if (tilesPlacement[parseInt(firstTileId)] == tilesPlacement[parseInt(secondTileId)]) {
        validTiles.push(firstTileId);
        validTiles.push(secondTileId);
        checkGameCompletion(); // Sprawdzenie, czy wszystkie kafelki zostały odkryte
    } else {
        firstEle.classList.remove("tileClicked");
        secondEle.classList.remove("tileClicked");
        firstEle.removeChild(firstEle.children.item(0));
        secondEle.removeChild(secondEle.children.item(0));
    }
}

function checkGameCompletion() {
    if (validTiles.length === 64) { // Jeśli wszystkie kafelki zostały odkryte
        gameFinished = true; // Zakończ grę
        stopGameTimer(); // Zatrzymaj timer
        alert("Gratulacje! Ukończyłeś grę w czasie: "+document.getElementById('gameTimer').textContent);
    }
}

function ClickMusic() {
    var audio = new Audio('/assets/click.mp3');
    audio.volume = 0.03;
    audio.play();
}

let startTime;
let gameTime = 0;

function startGameTimer() {
    startTime = Date.now();
    setInterval(updateGameTimer, 1000);
}

function stopGameTimer() {
    gameFinished = true; // Zatrzymanie timera
    clearInterval(updateGameTimer); // Zatrzymanie aktualizacji timera
}

function updateGameTimer() {
    gameTime = Math.floor((Date.now() - startTime) / 1000);
    let hours = Math.floor(gameTime / 3600);
    let minutes = Math.floor((gameTime % 3600) / 60);
    let seconds = gameTime % 60;
    document.getElementById('gameTimer').textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(time) {
    return time < 10 ? '0' + time : time;
}
