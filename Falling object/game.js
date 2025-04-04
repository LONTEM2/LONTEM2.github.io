const player = document.getElementById('player');
const gameContainer = document.querySelector('.game-container');
const gameOverText = document.getElementById('game-over');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('reset-button');

let playerX = gameContainer.offsetWidth / 2 - player.offsetWidth / 2;
let playerSpeed = 0;
let playerAcceleration = 0.5;
let playerFriction = 0.9;
let maxSpeed = 10;
let isGameOver = false;
let fallingSpeed = 2;
let time = 0;
let keys = {
    left: false,
    right: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = true;
    } else if (e.key === ' ') {
        resetGame();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        keys.left = false;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        keys.right = false;
    }
});

resetButton.addEventListener('click', () => {
    resetGame();
});

function resetGame() {
    location.reload();
}

function createFallingObject() {
    const fallingObject = document.createElement('div');
    fallingObject.classList.add('falling-object');
    fallingObject.style.left = `${Math.random() * (gameContainer.offsetWidth - 30)}px`;
    gameContainer.appendChild(fallingObject);
    return fallingObject;
}

function updateTimer() {
    if (!isGameOver) {
        time++;
        timerDisplay.textContent = `Time: ${time}`;
        if (time % 10 === 0) {
            fallingSpeed += 1; // Increase falling speed every 10 seconds
        }
    }
}

function updatePlayer() {
    if (keys.left) {
        playerSpeed -= playerAcceleration;
    } else if (keys.right) {
        playerSpeed += playerAcceleration;
    } else {
        playerSpeed *= playerFriction;
    }

    playerSpeed = Math.min(maxSpeed, Math.max(-maxSpeed, playerSpeed));
    playerX += playerSpeed;
    playerX = Math.max(0, Math.min(gameContainer.offsetWidth - player.offsetWidth, playerX));
    player.style.left = `${playerX}px`;
}

function gameLoop() {
    if (isGameOver) return;

    updatePlayer();

    const fallingObjects = document.querySelectorAll('.falling-object');
    fallingObjects.forEach(obj => {
        const top = parseFloat(obj.style.top || 0) + fallingSpeed;
        obj.style.top = `${top}px`;

        if (top > gameContainer.offsetHeight) {
            obj.remove();
        }

        const playerRect = player.getBoundingClientRect();
        const objRect = obj.getBoundingClientRect();

        if (
            playerRect.left < objRect.right &&
            playerRect.right > objRect.left &&
            playerRect.top < objRect.bottom &&
            playerRect.bottom > objRect.top
        ) {
            isGameOver = true;
            gameOverText.style.display = 'block';
        }
    });

    if (Math.random() < 0.02) {
        createFallingObject();
    }

    requestAnimationFrame(gameLoop);
}

setInterval(updateTimer, 1000); // Update timer every second
gameLoop();