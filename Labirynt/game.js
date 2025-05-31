const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// DOM
const coinsCollectedEl = document.getElementById("coinsCollected");
const coinsTotalEl = document.getElementById("coinsTotal");
const timerEl = document.getElementById("timer");
const endScreen = document.getElementById("endScreen");
const finalTimeEl = document.getElementById("finalTime");
const playAgainBtn = document.getElementById("playAgainBtn");
const restartBtn = document.getElementById("restartBtn");
const gameContainer = document.getElementById("gameContainer");
const startScreen = document.getElementById("startScreen");
const difficultyBtns = document.querySelectorAll(".difficultyBtn");

// --- DANE TRUDNOŚCI ---
const DIFFICULTY = {
    easy:    { rows: 21, cols: 21, tileSize: 36, minCoins: 5, coinRatio: 30 },
    medium:  { rows: 35, cols: 35, tileSize: 28, minCoins: 12, coinRatio: 35 },
    hard:    { rows: 51, cols: 51, tileSize: 18, minCoins: 20, coinRatio: 40 }
};

let currentDifficulty = 'easy';
let tileSize = DIFFICULTY.easy.tileSize;
let mazeRows = DIFFICULTY.easy.rows;
let mazeCols = DIFFICULTY.easy.cols;
let minCoins = DIFFICULTY.easy.minCoins;
let coinRatio = DIFFICULTY.easy.coinRatio;

const coinColor = "#FFD700";
const playerColor = "#1ed760";
const exitColor = "#2df";

let maze = [];
let player = {};
let exit = {};
let coins = [];
let coinsCollected = 0;
let coinsTotal = 0;
let timer = 0;
let timerInterval = null;
let gameEnded = false;

// Płynne poruszanie
const moveSpeed = 2.5; // pikseli na klatkê (można zmienić na np. tileSize/6 dla różnych trudności)
let moving = false;
let moveDir = null;
let moveQueue = [];
let pressedDirs = {};
let playerAnim = {
    x: 1, y: 1,
    tx: 1, ty: 1, // target (docelowa kratka)
    px: 1, py: 1, // pixel position (aktualny piksel)
    animating: false,
};

function generateMaze(rows, cols) {
    let maze = Array.from({length: rows}, (_, y) =>
        Array.from({length: cols}, (_, x) =>
            (x % 2 === 1 && y % 2 === 1 ? 1 : 0)
        )
    );

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    function carve(x, y, visited) {
        visited[y][x] = true;
        let directions = [
            [0, -2],
            [2, 0],
            [0, 2],
            [-2, 0]
        ];
        shuffle(directions);

        for (const [dx, dy] of directions) {
            const nx = x + dx, ny = y + dy;
            if (ny > 0 && ny < rows && nx > 0 && nx < cols && !visited[ny][nx]) {
                maze[y + dy / 2][x + dx / 2] = 1;
                carve(nx, ny, visited);
            }
        }
    }

    let visited = Array.from({length: rows}, () => Array(cols).fill(false));
    carve(1, 1, visited);

    maze[1][1] = 1; // start
    return maze;
}

function randomExit(rows, cols, startX, startY) {
    let borders = [];
    for (let x = 1; x < cols - 1; x += 2) {
        if (!(x === startX && 1 === startY)) borders.push({x, y: 1});
        if (!(x === startX && rows-2 === startY)) borders.push({x, y: rows-2});
    }
    for (let y = 3; y < rows - 2; y += 2) {
        if (!(1 === startX && y === startY)) borders.push({x: 1, y});
        if (!(cols-2 === startX && y === startY)) borders.push({x: cols-2, y});
    }
    return borders[Math.floor(Math.random() * borders.length)];
}

function getReachableTiles(maze, startX, startY) {
    let visited = Array.from({length: maze.length}, () => Array(maze[0].length).fill(false));
    let queue = [[startX, startY]];
    let reachable = [];
    visited[startY][startX] = true;

    while (queue.length > 0) {
        let [x, y] = queue.shift();
        reachable.push({x, y});
        for (let [dx, dy] of [[0,1],[1,0],[0,-1],[-1,0]]) {
            let nx = x + dx, ny = y + dy;
            if (maze[ny] && maze[ny][nx] === 1 && !visited[ny][nx]) {
                visited[ny][nx] = true;
                queue.push([nx, ny]);
            }
        }
    }
    return reachable;
}

function placeCoins(maze, reachableTiles, coinsCount, startPos, exitPos) {
    let available = reachableTiles.filter(t =>
        !(t.x === startPos.x && t.y === startPos.y) &&
        !(t.x === exitPos.x && t.y === exitPos.y)
    );
    shuffleArray(available);
    return available.slice(0, coinsCount).map(t => ({x: t.x, y: t.y, collected: false}));
}

function shuffleArray(arr) {
    for(let i=arr.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function setDifficulty(diff) {
    currentDifficulty = diff;
    tileSize = DIFFICULTY[diff].tileSize;
    mazeRows = DIFFICULTY[diff].rows;
    mazeCols = DIFFICULTY[diff].cols;
    minCoins = DIFFICULTY[diff].minCoins;
    coinRatio = DIFFICULTY[diff].coinRatio;

    canvas.width = mazeCols * tileSize;
    canvas.height = mazeRows * tileSize;
}

function initGame() {
    maze = generateMaze(mazeRows, mazeCols);
    player = {x: 1, y: 1, size: tileSize * 0.7};

    exit = randomExit(mazeRows, mazeCols, player.x, player.y);
    maze[exit.y][exit.x] = 1;

    let reachable = getReachableTiles(maze, player.x, player.y);
    coinsTotal = Math.max(minCoins, Math.floor(reachable.length / coinRatio));
    coins = placeCoins(maze, reachable, coinsTotal, player, exit);
    coinsCollected = 0;

    coinsCollectedEl.textContent = coinsCollected;
    coinsTotalEl.textContent = coinsTotal;
    timer = 0;
    timerEl.textContent = timer;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!gameEnded) {
            timer++;
            timerEl.textContent = timer;
        }
    }, 1000);

    endScreen.classList.add("hidden");
    gameEnded = false;

    // Reset płynnego poruszania
    playerAnim = {
        x: player.x,
        y: player.y,
        tx: player.x,
        ty: player.y,
        px: player.x * tileSize,
        py: player.y * tileSize,
        animating: false,
    };
    moving = false;
    moveDir = null;
    moveQueue = [];
    pressedDirs = {};

    draw();
}

// Rysowanie
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Maze
    for (let y = 0; y < mazeRows; y++) {
        for (let x = 0; x < mazeCols; x++) {
            if (maze[y][x] === 0) {
                ctx.fillStyle = "#2a2f4f";
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    // Exit
    ctx.fillStyle = exitColor;
    ctx.fillRect(exit.x * tileSize, exit.y * tileSize, tileSize, tileSize);
    ctx.fillStyle = "#fff";
    ctx.font = `${Math.floor(tileSize * 0.8)}px Arial`;
    ctx.fillText("⬆", exit.x * tileSize + tileSize * 0.2, exit.y * tileSize + tileSize * 0.7);

    // Coins
    for (const coin of coins) {
        if (!coin.collected) {
            ctx.beginPath();
            ctx.arc(coin.x * tileSize + tileSize / 2, coin.y * tileSize + tileSize / 2, tileSize * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = coinColor;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#bfa20a";
            ctx.stroke();
        }
    }

    // Player (animowany)
    ctx.beginPath();
    ctx.arc(
        playerAnim.px + tileSize / 2,
        playerAnim.py + tileSize / 2,
        player.size / 2,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = playerColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#444";
    ctx.stroke();

    // Player face
    ctx.beginPath();
    ctx.arc(playerAnim.px + tileSize / 2 - 4, playerAnim.py + tileSize / 2 - 2, 1.5, 0, Math.PI * 2);
    ctx.arc(playerAnim.px + tileSize / 2 + 4, playerAnim.py + tileSize / 2 - 2, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(playerAnim.px + tileSize / 2, playerAnim.py + tileSize / 2 + 4, 4, 0, Math.PI);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#000";
    ctx.stroke();
}

// --- Obsługa płynnego ruchu ---
function handleMovement() {
    if (gameEnded || gameContainer.classList.contains("hidden")) return;

    if (!playerAnim.animating) {
        // Wybierz kierunek do ruchu
        let dir = getCurrentDir();
        if (dir) {
            let [dx, dy] = dirToDelta(dir);
            let nx = playerAnim.x + dx;
            let ny = playerAnim.y + dy;
            if (maze[ny] && maze[ny][nx] === 1) {
                playerAnim.tx = nx;
                playerAnim.ty = ny;
                playerAnim.animating = true;
            }
        }
    }

    if (playerAnim.animating) {
        let dx = playerAnim.tx - playerAnim.x;
        let dy = playerAnim.ty - playerAnim.y;
        let targetPx = playerAnim.tx * tileSize;
        let targetPy = playerAnim.ty * tileSize;

        // Przesuwanie
        let stepX = dx * moveSpeed;
        let stepY = dy * moveSpeed;

        if (Math.abs(targetPx - playerAnim.px) <= Math.abs(stepX) && Math.abs(targetPy - playerAnim.py) <= Math.abs(stepY)) {
            // dotarł do celu kratki
            playerAnim.px = targetPx;
            playerAnim.py = targetPy;
            playerAnim.x = playerAnim.tx;
            playerAnim.y = playerAnim.ty;
            playerAnim.animating = false;

            // Logika gry
            player.x = playerAnim.x;
            player.y = playerAnim.y;
            checkCoinCollect();
            checkWin();
        } else {
            playerAnim.px += stepX;
            playerAnim.py += stepY;
        }
    }

    draw();
    requestAnimationFrame(handleMovement);
}

// Kierunki
function dirToDelta(dir) {
    switch (dir) {
        case "up": return [0, -1];
        case "down": return [0, 1];
        case "left": return [-1, 0];
        case "right": return [1, 0];
        default: return [0, 0];
    }
}

function getCurrentDir() {
    // priorytet: ostatnio wciśnięty klawisz (z pressedDirs)
    if (pressedDirs["up"]) return "up";
    if (pressedDirs["down"]) return "down";
    if (pressedDirs["left"]) return "left";
    if (pressedDirs["right"]) return "right";
    return null;
}

const keyToDir = {
    "ArrowUp": "up", "w": "up", "W": "up",
    "ArrowDown": "down", "s": "down", "S": "down",
    "ArrowLeft": "left", "a": "left", "A": "left",
    "ArrowRight": "right", "d": "right", "D": "right"
};

// Klawiatura
window.addEventListener("keydown", e => {
    let dir = keyToDir[e.key];
    if (dir) {
        pressedDirs[dir] = true;
        e.preventDefault();
    }
});
window.addEventListener("keyup", e => {
    let dir = keyToDir[e.key];
    if (dir) {
        pressedDirs[dir] = false;
        e.preventDefault();
    }
});

// --- KONIEC obsługi płynnego ruchu ---

function checkCoinCollect() {
    for (const coin of coins) {
        if (!coin.collected && coin.x === player.x && coin.y === player.y) {
            coin.collected = true;
            coinsCollected++;
            coinsCollectedEl.textContent = coinsCollected;
        }
    }
}

function checkWin() {
    if (player.x === exit.x && player.y === exit.y && coinsCollected === coinsTotal) {
        gameEnded = true;
        clearInterval(timerInterval);
        finalTimeEl.textContent = timer;
        endScreen.classList.remove("hidden");
    }
}

// Obsługa wyboru trudności
difficultyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        setDifficulty(btn.dataset.diff);
        startScreen.classList.add("hidden");
        gameContainer.classList.remove("hidden");
        initGame();
        requestAnimationFrame(handleMovement);
    });
});

// Buttons
restartBtn.addEventListener("click", () => {
    startScreen.classList.remove("hidden");
    gameContainer.classList.add("hidden");
    endScreen.classList.add("hidden");
});
playAgainBtn.addEventListener("click", () => {
    initGame();
    requestAnimationFrame(handleMovement);
});

// Pierwsze uruchomienie
gameContainer.classList.add("hidden");
startScreen.classList.remove("hidden");