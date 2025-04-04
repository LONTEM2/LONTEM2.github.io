// Function to block the possibility of interfering with JS code in the source page
(function() {
    'use strict';

    document.addEventListener('contextmenu', event => event.preventDefault());
    document.onkeydown = function(e) {
        if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I") || (e.ctrlKey && e.shiftKey && e.key === "J")) {
            return false;
        }
    };
})();

let balls = [];
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const gameContainer = document.getElementById("game-container");
let score = 0;
let gameInterval;
let gameDuration;
let timeElapsed = 0;
let timerInterval;
let gameEnded = false;

document.getElementById("apply-settings").addEventListener("click", () => {
    gameEnded = false;
    const language = document.getElementById("language").value;
    const time = document.getElementById("time").value;
    const shape = document.getElementById("shape").value;
    const size = document.getElementById("size").value;
    const areaSize = document.getElementById("area-size").value;
    const ballsCount = parseInt(document.getElementById("balls").value);

    // Set language
    if (language === "en") {
        document.getElementById("settings-title").textContent = "Settings";
        document.getElementById("language-label").textContent = "Language:";
        document.getElementById("time-label").textContent = "Game Time:";
        document.getElementById("shape-label").textContent = "Shape:";
        document.getElementById("size-label").textContent = "Ball Size:";
        document.getElementById("area-size-label").textContent = "Area Size:";
        document.getElementById("balls-label").textContent = "Number of Balls:";
        document.getElementById("apply-settings").textContent = "Apply";
        scoreDisplay.textContent = `Points: ${score}`;
        timerDisplay.textContent = time === "unlimited" ? "Time: ∞" : `Time: ${time}s`;
    } else {
        document.getElementById("settings-title").textContent = "Ustawienia";
        document.getElementById("language-label").textContent = "Język:";
        document.getElementById("time-label").textContent = "Czas rozgrywki:";
        document.getElementById("shape-label").textContent = "Kształt:";
        document.getElementById("size-label").textContent = "Wielkość kulki:";
        document.getElementById("area-size-label").textContent = "Wielkość planszy:";
        document.getElementById("balls-label").textContent = "Ilość kulek:";
        document.getElementById("apply-settings").textContent = "Zastosuj";
        scoreDisplay.textContent = `Punkty: ${score}`;
        timerDisplay.textContent = time === "unlimited" ? "Czas: ∞" : `Czas: ${time}s`;
    }

    // Reset score and time
    score = 0;
    timeElapsed = 0;
    scoreDisplay.textContent = language === "en" ? `Points: ${score}` : `Punkty: ${score}`;
    if (time === "unlimited") {
        timerDisplay.textContent = language === "en" ? `Time: ∞` : `Czas: ∞`;
    } else {
        timeElapsed = parseInt(time);
        timerDisplay.textContent = language === "en" ? `Time: ${timeElapsed}s` : `Czas: ${timeElapsed}s`;
    }

    // Set game duration
    clearTimeout(gameInterval);
    clearInterval(timerInterval);
    if (time !== "unlimited") {
        gameDuration = parseInt(time);
        gameInterval = setTimeout(endGame, gameDuration * 1000);
        timerInterval = setInterval(updateTimer, 1000);
    } else {
        timerInterval = setInterval(updateTimer, 1000);
    }

    // Set game area size
    gameContainer.classList.remove("small", "medium", "large");
    gameContainer.classList.add(areaSize);

    // Clear previous balls
    const ballsContainer = document.getElementById("balls-container");
    ballsContainer.innerHTML = '';
    balls = [];

    // Create new balls
    for (let i = 0; i < ballsCount; i++) {
        const ball = document.createElement("div");
        ball.classList.add("ball");
        if (shape === "circle") {
            ball.classList.add("circle");
        }
        ball.classList.add(size);
        ball.addEventListener("click", () => {
            if (!gameEnded) {
                score++;
                scoreDisplay.textContent = language === "en" ? `Points: ${score}` : `Punkty: ${score}`;
                moveBall(ball);
            }
        });
        ballsContainer.appendChild(ball);
        balls.push(ball);
    }

    moveBalls();
});

function moveBalls() {
    balls.forEach(ball => moveBall(ball));
}

function moveBall(ball) {
    point_sound();
    const container = document.getElementById("balls-container");
    const containerRect = container.getBoundingClientRect();

    const maxX = containerRect.width - ball.offsetWidth;
    const maxY = containerRect.height - ball.offsetHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    ball.style.left = `${randomX}px`;
    ball.style.top = `${randomY}px`;
}

function updateTimer() {
    if (!gameEnded) {
        timeElapsed--;
        if (timeElapsed >= 0) {
            timerDisplay.textContent = language === "en" ? `Time: ${timeElapsed}s` : `Czas: ${timeElapsed}s`;
        }
    }
}

// Function to end the game
function endGame() {
    gameEnded = true;
    const language = document.getElementById("language").value;
    alert(language === "en" ? `Game over! Your score is: ${score} points.` : `Koniec gry! Twój wynik to: ${score} punktów.`);
    score = 0;
    timeElapsed = 0;
    scoreDisplay.textContent = language === "en" ? `Points: ${score}` : `Punkty: ${score}`;
    timerDisplay.textContent = language === "en" ? `Time: 0s` : `Czas: 0s`;
    clearTimeout(gameInterval);
    clearInterval(timerInterval);
}

// Initial position of the balls
moveBalls();

function point_sound() {
    let audio = new Audio("pop.mp3");
    audio.volume = 0.03;
    audio.play();
  }