import { createClient } from '@supabase/supabase-js';

// Konfiguracja API
const supabaseUrl = 'https://fpdjsmcphboosmokzsfy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const supabase = createClient(supabaseUrl, supabaseKey);

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ładowanie obrazów
const images = {
  bird: "../assets/yellowbird-midflap.png",
  background: "../assets/background.png",
  pipeTop: "../assets/pipe-green-down.png",
  pipeBottom: "../assets/pipe-green.png",
  base: "../assets/base.png",
};

const birdImage = new Image();
birdImage.src = images.bird;

const backgroundImage = new Image();
backgroundImage.src = images.background;

const pipeImageTop = new Image();
pipeImageTop.src = images.pipeTop;

const pipeImageBottom = new Image();
pipeImageBottom.src = images.pipeBottom;

const baseImage = new Image();
baseImage.src = images.base;

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

// Stan gry
let score = 0;
let gameRunning = false;
let userName = "";

// Inicjalizacja dźwięków
const sounds = {
  point: new Audio("../assets/point.wav"),
  wing: new Audio("../assets/wing.wav"),
  hit: new Audio("../assets/hit.wav"),
  swoosh: new Audio("../assets/swoosh.wav"),
};

Object.values(sounds).forEach((sound) => (sound.volume = 1));

// Funkcja odtwarzania dźwięków
function playSound(sound) {
  sounds[sound]?.play();
}

// Tworzenie elementów interfejsu
const resetButton = createButton("Reset Game", "resetButton", () => resetGame());
const nameForm = createNameForm();
const leaderboard = createLeaderboard();
const controlsDescription = createControlsDescription();

// Elementy interfejsu
function createButton(text, id, onClick) {
  const button = document.createElement("button");
  button.id = id;
  button.innerText = text;
  button.style.position = "absolute";
  button.style.top = "50%";
  button.style.left = "50%";
  button.style.transform = "translate(-50%, -50%)";
  button.style.fontSize = "20px";
  button.style.padding = "10px 20px";
  button.style.backgroundColor = "#ffcc00";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.display = "none";
  button.addEventListener("click", onClick);
  document.body.appendChild(button);
  return button;
}

function createNameForm() {
  const form = document.createElement("div");
  form.innerHTML = `
    <label for="userName">Enter your name:</label>
    <input type="text" id="userName" />
    <button id="startButton">Start Game</button>
  `;
  form.style.position = "absolute";
  form.style.top = "10px";
  form.style.right = "10px";
  form.style.fontSize = "20px";
  form.style.textAlign = "center";
  form.style.backgroundColor = "#222";
  form.style.padding = "20px";
  form.style.borderRadius = "10px";
  form.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  form.style.color = "#fff";
  document.body.appendChild(form);
  document.getElementById("startButton").addEventListener("click", startGame);
  return form;
}

function createLeaderboard() {
  const board = document.createElement("div");
  board.style.position = "absolute";
  board.style.left = "20px";
  board.style.top = "150px";
  board.style.backgroundColor = "#333";
  board.style.padding = "15px";
  board.style.fontSize = "18px";
  board.style.border = "2px solid #000";
  board.style.borderRadius = "10px";
  board.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  board.style.color = "#fff";
  board.innerHTML = "<h2>Top 10</h2>";
  document.body.appendChild(board);
  return board;
}

function createControlsDescription() {
  const description = document.createElement("div");
  description.innerHTML = `
    <h3>Controls:</h3>
    <p><strong>Space</strong> or <strong>Click</strong> to make the bird jump</p>
  `;
  description.style.position = "absolute";
  description.style.left = "20px";
  description.style.top = "10px";
  description.style.fontSize = "16px";
  description.style.color = "#fff";
  description.style.borderRadius = "10px";
  description.style.backgroundColor = "#333";
  description.style.textAlign = "left";
  document.body.appendChild(description);
  return description;
}

// Obsługa tabeli wyników z API
async function loadLeaderboard() {
  const { data: scores, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error loading leaderboard:", error);
    return;
  }

  leaderboard.innerHTML = "<h2>Top 10</h2>";
  scores.forEach((entry, index) => {
    const entryElement = document.createElement("div");
    entryElement.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
    leaderboard.appendChild(entryElement);
  });
}

async function saveScore(name, score) {
  const { data, error } = await supabase
    .from("leaderboard")
    .insert([{ name, score }]);

  if (error) {
    console.error("Error saving score:", error);
  } else {
    console.log("Score saved:", data);
  }
  loadLeaderboard();
}

// Logika gry i aktualizacja stanów
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

function startGame() {
  userName = document.getElementById("userName").value.trim();
  if (!userName) {
    alert("Please enter a valid name!");
    return;
  }
  nameForm.style.display = "none";
  resetGame();
}

// Funkcja rysująca elementy gry
function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y);
}

function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawBase() {
  ctx.drawImage(baseImage, 0, canvas.height - baseHeight);
}

function drawPipes() {
  pipes.forEach((pipe) => {
    ctx.drawImage(pipeImageTop, pipe.x, pipe.top);
    ctx.drawImage(pipeImageBottom, pipe.x, pipe.bottom);
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText("Score: " + score, 20, 40);
}

// Funkcja sprawdzająca kolizje
function checkCollisions() {
  if (bird.y <= 0 || bird.y + bird.height >= canvas.height - baseHeight) {
    playSound("hit");
    gameRunning = false;
    resetButton.style.display = "block";
    saveScore(userName, score);
  }

  pipes.forEach((pipe) => {
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      playSound("hit");
      gameRunning = false;
      resetButton.style.display = "block";
      saveScore(userName, score);
    }
  });
}

// Funkcja do generowania rur
function createPipe() {
  const pipeTopHeight = Math.floor(Math.random() * (canvas.height / 2));
  const pipeBottomHeight = canvas.height - pipeTopHeight - pipeGap;
  pipes.push({
    x: canvas.width,
    top: pipeTopHeight,
    bottom: pipeTopHeight + pipeGap,
  });
}

// Funkcja do aktualizacji gry
function update() {
  if (gameRunning) {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - baseHeight) bird.y = canvas.height - baseHeight;
    if (bird.y < 0) bird.y = 0;

    pipes.forEach((pipe) => {
      pipe.x -= 2;
    });

    if (pipes.length && pipes[0].x < -pipeWidth) pipes.shift();
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) createPipe();

    pipes.forEach((pipe) => {
      if (pipe.x + pipeWidth <= bird.x && !pipe.passed) {
        pipe.passed = true;
        score++;
        playSound("point");
      }
    });

    checkCollisions();
    draw();
  }
}

// Funkcja do rysowania wszystkich elementów
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawBird();
  drawPipes();
  drawBase();
  drawScore();
}

// Obsługa skoku ptaka
document.addEventListener("keydown", (event) => {
  if (event.key === " " && gameRunning) {
    bird.velocity = bird.lift;
    playSound("wing");
  }
});

document.addEventListener("click", () => {
  if (gameRunning) {
    bird.velocity = bird.lift;
    playSound("wing");
  }
});

// Główna pętla gry
function gameLoop() {
  update();
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

loadLeaderboard();
