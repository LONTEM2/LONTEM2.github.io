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
const pipeGap = 150;
let score = 0;
let gameRunning = false;
let userName = "";

// Tworzenie przycisku resetu
const resetButton = document.createElement("button");
resetButton.innerText = "Reset Game";
resetButton.style.position = "absolute";
resetButton.style.top = "50%";
resetButton.style.left = "50%";
resetButton.style.transform = "translate(-50%, -50%)";
resetButton.style.fontSize = "20px";
resetButton.style.padding = "10px 20px";
resetButton.style.backgroundColor = "#ffcc00";
resetButton.style.border = "none";
resetButton.style.cursor = "pointer";
resetButton.style.display = "none";
document.body.appendChild(resetButton);

// Formularz do wpisania nicku
const nameForm = document.createElement("div");
nameForm.innerHTML = `
  <label for="userName">Enter your name:</label>
  <input type="text" id="userName" />
  <button id="startButton">Start Game</button>
`;
nameForm.style.position = "absolute";
nameForm.style.top = "10px";
nameForm.style.right = "10px";
nameForm.style.fontSize = "20px";
nameForm.style.textAlign = "center";
nameForm.style.backgroundColor = "#222";
nameForm.style.padding = "20px";
nameForm.style.borderRadius = "10px";
nameForm.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
nameForm.style.color = "#fff";
document.body.appendChild(nameForm);

// Tabela wyników (bez Supabase)
const leaderboard = document.createElement("div");
leaderboard.style.position = "absolute";
leaderboard.style.left = "20px";
leaderboard.style.top = "150px";
leaderboard.style.backgroundColor = "#333";
leaderboard.style.padding = "15px";
leaderboard.style.fontSize = "18px";
leaderboard.style.border = "2px solid #000";
leaderboard.style.borderRadius = "10px";
leaderboard.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
leaderboard.style.color = "#fff";
leaderboard.innerHTML = "<h2>Top Scores</h2>";
document.body.appendChild(leaderboard);

// Funkcja do załadowania wyników (lokalnie)
function loadLeaderboard() {
  const leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.innerHTML = "<h2>Top Scores</h2>";
  leaderboardData.forEach((entry, index) => {
    const entryElement = document.createElement("div");
    entryElement.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
    leaderboard.appendChild(entryElement);
  });
}

// Funkcja do zapisywania wyniku lokalnie
// Funkcja do zapisywania wyniku lokalnie
function saveScore(name, score) {
  let leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];
  
  // Sprawdzanie, czy użytkownik już jest na liście
  const existingUserIndex = leaderboardData.findIndex(entry => entry.name === name);
  
  if (existingUserIndex !== -1) {
    // Zaktualizuj wynik użytkownika
    leaderboardData[existingUserIndex].score = score;
  } else {
    // Dodaj nowego użytkownika
    leaderboardData.push({ name, score });
  }
  
  leaderboardData.sort((a, b) => b.score - a.score); // Sortuj wyniki malejąco
  leaderboardData = leaderboardData.slice(0, 10);  // Ograniczamy do top 10
  
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

  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver();
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= 2;
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver();
    }
    if (bird.y + bird.height >= canvas.height - baseHeight) {
      gameOver();
    }
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
      point_sound();
    }
  });

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
  saveScore(userName, score);
}

function startGame() {
  userName = document.getElementById("userName").value.trim();
  if (userName === "") {
    alert("Please enter a valid name!");
    return;
  }
  nameForm.style.display = "none";
  resetGame();
}

document.getElementById("startButton").addEventListener("click", startGame);

function resetGame() {
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

// Dźwięki
function point_sound() {
  let audio = new Audio("../assets/point.wav");
  audio.volume = 1;
  audio.play();
}
function wing_sound() {
  let audio = new Audio("../assets/wing.wav");
  audio.volume = 1;
  audio.play();
}
function hit_sound() {
  let audio = new Audio("../assets/hit.wav");
  audio.volume = 0.2;
  audio.play();
}
function swoosh_sound() {
  let audio = new Audio("../assets/swoosh.wav");
  audio.volume = 1;
  audio.play();
}

// Ładowanie tabeli wyników
loadLeaderboard();

// Dodanie opisu kontrolerów po lewej
const controlsDescription = document.createElement("div");
controlsDescription.innerHTML = `
  <h3>Controls:</h3>
  <p><strong>Space</strong> or <strong>Click</strong> to make the bird jump</p>
`;
controlsDescription.style.position = "absolute";
controlsDescription.style.left = "20px";
controlsDescription.style.top = "10px";
controlsDescription.style.fontSize = "16px";
controlsDescription.style.color = "#fff";
controlsDescription.style.borderRadius = "10px";
controlsDescription.style.backgroundColor = "#333";
controlsDescription.style.textAlign = "left";
controlsDescription.style.padding = "10px";
controlsDescription.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
document.body.appendChild(controlsDescription);
