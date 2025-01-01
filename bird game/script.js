const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImage = new Image();
birdImage.src = "../assets/yellowbird-midflap.png";

const backgroundImage = new Image();
backgroundImage.src = "../assets/background.png";

const bird = {
  x: 50,
  y: canvas.height / 2,
  width: 34,
  height: 24,
  gravity: 0.2,
  lift: -6,
  velocity: 0,
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
let score = 0;
let gameRunning = false;
let gameStartedAt = 0;
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
resetButton.style.display = "none"; // Ukryty na początku
document.body.appendChild(resetButton);

// Formularz do wprowadzenia nicku (na górze prawej strony)
const nameForm = document.createElement("div");
nameForm.innerHTML = `
  <label for="userName">Enter your name:</label>
  <input type="text" id="userName" />
  <button id="startButton">Start Game</button>
`;
nameForm.style.position = "absolute";
nameForm.style.top = "10px"; // Formularz na górze
nameForm.style.right = "10px"; // Formularz po prawej stronie
nameForm.style.fontSize = "20px";
nameForm.style.textAlign = "center";
nameForm.style.backgroundColor = "#222"; // Ciemne tło
nameForm.style.padding = "20px";
nameForm.style.borderRadius = "10px";
nameForm.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
nameForm.style.color = "#fff"; // Biały tekst
document.body.appendChild(nameForm);

// Tabela wyników (Top 10) poniżej kontrolerów
const leaderboard = document.createElement("div");
leaderboard.style.position = "absolute";
leaderboard.style.left = "20px";
leaderboard.style.top = "150px"; // Pod kontrolerami
leaderboard.style.backgroundColor = "#333";
leaderboard.style.padding = "15px";
leaderboard.style.fontSize = "18px";
leaderboard.style.border = "2px solid #000";
leaderboard.style.borderRadius = "10px";
leaderboard.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
leaderboard.style.color = "#fff"; // Biały tekst
leaderboard.innerHTML = "<h2>Top 10</h2>";
document.body.appendChild(leaderboard);

// Wczytywanie wyników z LocalStorage
function loadLeaderboard() {
  const storedScores = JSON.parse(localStorage.getItem("topScores")) || [];
  leaderboard.innerHTML = "<h2>Top 10</h2>";
  storedScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach((entry, index) => {
      const entryElement = document.createElement("div");
      entryElement.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
      leaderboard.appendChild(entryElement);
    });
}

// Zapisywanie wyniku do LocalStorage
function saveScore(name, score) {
  const storedScores = JSON.parse(localStorage.getItem("topScores")) || [];
  
  // Sprawdzanie, czy gracz już ma wynik w tabeli
  const existingPlayerIndex = storedScores.findIndex((entry) => entry.name === name);
  
  if (existingPlayerIndex > -1) {
    // Jeśli gracz już istnieje, aktualizujemy jego wynik
    storedScores[existingPlayerIndex].score = Math.max(storedScores[existingPlayerIndex].score, score);
  } else {
    // Jeśli gracz nie istnieje, dodajemy nowy wynik
    const newEntry = { name, score };
    storedScores.push(newEntry);
  }

  storedScores.sort((a, b) => b.score - a.score);
  if (storedScores.length > 10) storedScores.pop(); // Trzymamy tylko top 10
  localStorage.setItem("topScores", JSON.stringify(storedScores));
}

// Tworzenie rur
function createPipe() {
  const topHeight = Math.random() * (canvas.height / 2);
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - (topHeight + pipeGap),
  });
}

// Rysowanie gry
function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

  pipes.forEach((pipe) => {
    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top); // Górna rura
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom); // Dolna rura
  });

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Aktualizacja stanu gry
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

// Pętla gry
function gameLoop() {
  if (gameRunning) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render();
    update();
    requestAnimationFrame(gameLoop);
  }
}

// Kontrola ptaka (spacja lub lewy przycisk myszy)
function jump() {
  bird.velocity = bird.lift;
}

// Kończenie gry
function gameOver() {
  gameRunning = false;
  resetButton.style.display = "inline-block"; // Pokazywanie przycisku resetu
  saveScore(userName, score); // Zapisywanie wyniku
  loadLeaderboard(); // Aktualizacja tabeli wyników
}

// Funkcja do rozpoczęcia gry
function startGame() {
  userName = document.getElementById("userName").value.trim();
  if (userName === "") {
    alert("Please enter a valid name!");
    return; // Zatrzymanie gry, jeśli nie ma nazwy
  }
  nameForm.style.display = "none"; // Ukrycie formularza
  resetGame();
}

document.getElementById("startButton").addEventListener("click", function() {
  startGame();
});

// Resetowanie gry
function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
  gameRunning = true;
  gameStartedAt = Date.now();
  resetButton.style.display = "none"; // Ukrywanie przycisku resetu
  loadLeaderboard(); // Załaduj tabelę wyników
  gameLoop(); // Rozpocznij pętlę gry
}

// Kontrola klawiszy
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!gameRunning) {
      resetGame();
    } else {
      jump();
      wing_sound();
    }
  }
});

// Kliknięcie lewego przycisku myszy
canvas.addEventListener("click", () => {
  if (!gameRunning) {
    resetGame();
  } else {
    jump();
    wing_sound();
  }
});

// Resetowanie gry po kliknięciu przycisku
resetButton.addEventListener("click", resetGame);

// Rozpoczynamy grę
loadLeaderboard();  // Wczytujemy tabelę wyników od razu

// Dodanie opisu kontrolerów po lewej stronie
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
document.body.appendChild(controlsDescription);

function point_sound() {
    let audio = new Audio('../assets/point.wav');
    audio.volume = 1;
    audio.play();
}
function wing_sound() {
    let audio = new Audio('../assets/wing.wav');
    audio.volume = 1;
    audio.play();
}
