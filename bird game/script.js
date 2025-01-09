const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ładowanie obrazów
const birdImage = new Image();
birdImage.src = "../assets/yellowbird-midflap.png";

const backgroundImage = new Image();
backgroundImage.src = "../assets/background.png";

const pipeImageTop = new Image();
pipeImageTop.src = "../assets/pipe-green-down.png";

const pipeImageBottom = new Image();
pipeImageBottom.src = "../assets/pipe-green.png";

const baseImage = new Image();
baseImage.src = "../assets/base.png";
const baseHeight = baseImage.height;

// Parametry ptaka
const bird = {
  x: 50,
  y: canvas.height / 2,
  width: 34,
  height: 24,
  gravity: 0.2,
  lift: -6,
  velocity: 2,
};

// Rury
const pipes = [];
const pipeWidth = 52;
let pipeGap = 150;
let pipeSpeed = 2;

let score = 0;
let gameRunning = false;
let userName = "";
let difficulty = "easy"; // Domyślnie ustawione na "easy"

// Tworzenie przycisku resetu
const resetButton = document.createElement("button");
resetButton.id = "resetButton";
resetButton.innerText = "Reset Game";
document.body.appendChild(resetButton);

// Formularz do wpisania nicku
const nameForm = document.createElement("div");
nameForm.id = "nameForm";
nameForm.innerHTML = `
  <label for="userName">Enter your name:</label>
  <input type="text" id="userName" maxlength="7" />
  <button id="startButton">Start Game</button>
  <label style="margin-left: 20px;">
    Difficulty:
    <select id="difficultySelect">
      <option value="easy">Easy</option>
      <option value="hard">Hard</option>
    </select>
  </label>
`;
document.body.appendChild(nameForm);

// Tabela wyników
const leaderboard = document.createElement("div");
leaderboard.id = "leaderboard";
leaderboard.innerHTML = "<h2>Top Scores</h2>";
document.body.appendChild(leaderboard);

// Funkcja do załadowania wyników (lokalnie)
function loadLeaderboard() {
  const leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.innerHTML = "<h2>Top Scores</h2>";
  leaderboardData.forEach((entry, index) => {
    const entryElement = document.createElement("div");
    entryElement.textContent = `${index + 1}. ${entry.name}: ${entry.score} (${entry.difficulty})`;
    leaderboard.appendChild(entryElement);
  });
}

// Funkcja do zapisywania wyniku lokalnie
function saveScore(name, score, difficulty) {
  let leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];
  
  const existingUserIndex = leaderboardData.findIndex(entry => entry.name === name && entry.difficulty === difficulty);
  
  if (existingUserIndex !== -1) {
    leaderboardData[existingUserIndex].score = Math.max(leaderboardData[existingUserIndex].score, score);
  } else {
    leaderboardData.push({ name, score, difficulty });
  }
  
  leaderboardData.sort((a, b) => b.score - a.score);
  leaderboardData = leaderboardData.slice(0, 10);
  
  localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));
}

// Funkcja gry
function createPipe() {
  const minTopHeight = 50;
  const maxTopHeight = canvas.height - baseHeight - pipeGap - 50;
  const topHeight = Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - (topHeight + pipeGap),
  });
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

  pipes.forEach((pipe) => {
    ctx.drawImage(pipeImageTop, pipe.x, pipe.top - pipeImageTop.height);
    ctx.drawImage(pipeImageBottom, pipe.x, canvas.height - pipe.bottom);
  });

  ctx.drawImage(baseImage, 0, canvas.height - baseHeight, canvas.width, baseHeight);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}


function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Sprawdzanie kolizji z ziemią i górą
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver();
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;

    // Kolizja z rurami
    const pipeTopY = pipe.top - pipeImageTop.height;
    const pipeBottomY = canvas.height - pipe.bottom;

    // Hitboxy rur z marginesem bezpieczeństwa
    if (
      bird.x + bird.width > pipe.x && // Kolizja po osi X
      bird.x < pipe.x + pipeWidth &&  // Kolizja po osi X
      (bird.y + bird.height > pipeTopY && bird.y < pipeTopY + pipeImageTop.height ||  // Kolizja z górną rurą
      bird.y + bird.height > pipeBottomY && bird.y < pipeBottomY + pipeImageBottom.height) // Kolizja z dolną rurą
    ) {
      gameOver();
    }

    // Kolizja z ziemią
    if (bird.y + bird.height >= canvas.height - baseHeight) {
      gameOver();
    }

    // Usunięcie rury po przejściu
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
      point_sound();
    }
  });

  // Dodawanie nowych rur
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    createPipe();
  }
}


function gameLoop() {
  if (gameRunning) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render();
    update();
    requestAnimationFrame(gameLoop);
  }
}

function jump() {
  bird.velocity = bird.lift;
}

function gameOver() {
  hit_sound();
  gameRunning = false;
  resetButton.style.display = "inline-block";
  swoosh_sound();
  saveScore(userName, score, difficulty);
}

function startGame() {
  userName = document.getElementById("userName").value.trim();
  if (userName === "") {
    alert("Please enter a valid name!");
    return;
  }

  difficulty = document.getElementById("difficultySelect").value; // Pobranie wybranego poziomu trudności

  if (difficulty === "hard") {
    pipeGap = 130;
    pipeSpeed = 4;
    bird.lift = -7;
    bird.gravity = 0.3;
  } else {
    pipeGap = 150;
    pipeSpeed = 2;
    bird.gravity = 0.2;
    bird.lift = -6;
  }

  nameForm.style.display = "none";
  resetGame();
}

document.getElementById("startButton").addEventListener("click", startGame);

function resetGame() {
  gameRunning = false;
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
  gameRunning = true;
  resetButton.style.display = "none";
  loadLeaderboard();
  gameLoop();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!gameRunning && userName !== "") {
      resetGame();
    } else if (gameRunning) {
      jump();
      wing_sound();
    } else {
      alert("Please enter your name before starting the game!");
    }
  }
});

canvas.addEventListener("click", () => {
  if (!gameRunning && userName !== "") {
    resetGame();
  } else if (gameRunning) {
    jump();
    wing_sound();
  } else {
    alert("Please enter your name before starting the game!");
  }
});

resetButton.addEventListener("click", resetGame);

// Usunięcie zaznaczenia tekstu po kliknięciu
canvas.addEventListener("mousedown", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

// Dźwięki
function point_sound() {
  let audio = new Audio("../assets/point.wav");
  audio.volume = 1;
  audio.play();
}
function wing_sound() {
  let audio = new Audio("../assets/wing.wav");
  audio.volume = 0.3;
  audio.play();
}
function swoosh_sound() {
  let audio = new Audio("../assets/swoosh.wav");
  audio.volume = 0.5;
  audio.play();
}
function hit_sound() {
  let audio = new Audio("../assets/hit.wav");
  audio.volume = 0.6;
  audio.play();
}

// Opis kontrolerów
const controlsDescription = document.createElement("div");
controlsDescription.innerHTML = `
  <h3>Controls:</h3>
  <p><strong>Space</strong> or <strong>Click</strong> to make the bird jump</p>
`;
controlsDescription.id = "controlsDescription";
document.body.appendChild(controlsDescription);

// Inicjalizacja
loadLeaderboard();


