const rankingTable = document.querySelector('#ranking-table tbody');
const addPlayerForm = document.getElementById('add-player-form');
const gameHistoryForm = document.getElementById('game-history-form');
const gameHistoryList = document.getElementById('game-history-list');
const saveJsonButton = document.getElementById('save-json');

let players = [];
let gameHistory = [];

const adminPanel = document.getElementById('admin-panel');
adminPanel.style.display = 'none';
const encodedPassword = 'WFNLZGZsc0FGa3Nsc2ZsZHNTbHNMc2xzYXM=';

const adminLoginBtn = document.getElementById('admin-login');
if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
        const password = prompt('Podaj hasło administratora:');
        const decodedPassword = atob(encodedPassword);
        if (password === decodedPassword) {
            adminPanel.style.display = 'block';
        } else {
            alert('Błędne hasło!');
        }
    });
} else {
    console.error('Przycisk logowania nie znaleziony! Sprawdź ID: admin-login');
}

// Funkcja do automatycznego ładowania danych JSON
function loadJsonData() {
    fetch('ranking.json')
        .then(response => {
            if (!response.ok) throw new Error('Błąd ładowania pliku JSON');
            return response.json();
        })
        .then(data => {
            players = data.players || [];
            gameHistory = data.gameHistory || [];
            updateRanking();
            renderHistory();
        })
        .catch(error => console.error('Błąd:', error));
}

saveJsonButton.addEventListener('click', () => {
    const data = JSON.stringify({ players, gameHistory }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ranking.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

gameHistoryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const player1 = document.getElementById('game-player1').value.trim();
    const player2 = document.getElementById('game-player2').value.trim();
    const score1 = parseInt(document.getElementById('game-score1').value, 10);
    const score2 = parseInt(document.getElementById('game-score2').value, 10);

    if (!player1 || !player2 || isNaN(score1) || isNaN(score2)) {
        alert('Wypełnij wszystkie pola poprawnie!');
        return;
    }

    if (!validScore(score1, score2)) {
        alert('Nieprawidłowy wynik! Jeden z graczy musi mieć przewagę co najmniej 2 punktów.');
        return;
    }

    const [eloChange1, eloChange2] = calculateElo(player1, player2, score1, score2);

    const gameRecord = { player1, player2, score1, score2, eloChange1, eloChange2 };
    gameHistory.push(gameRecord);

    const p1 = players.find(p => p.name === player1);
    const p2 = players.find(p => p.name === player2);

    if (p1) p1.elo += eloChange1;
    if (p2) p2.elo += eloChange2;

    updateRanking();
    renderHistory();
    gameHistoryForm.reset();
});

function calculateElo(player1, player2, score1, score2) {
    const p1 = players.find(p => p.name === player1);
    const p2 = players.find(p => p.name === player2);
    if (!p1 || !p2) return [0, 0];

    const eloDiff = p2.elo - p1.elo;
    const kFactor = 32;

    const expectedScore1 = 1 / (1 + Math.pow(10, eloDiff / 400));
    const expectedScore2 = 1 - expectedScore1;

    const actualScore1 = score1 > score2 ? 1 : 0;
    const actualScore2 = score2 > score1 ? 1 : 0;

    const eloChange1 = Math.round(kFactor * (actualScore1 - expectedScore1));
    const eloChange2 = Math.round(kFactor * (actualScore2 - expectedScore2));

    return [eloChange1, eloChange2];
}

function validScore(score1, score2) {
    return (score1 >= 11 || score2 >= 11) && Math.abs(score1 - score2) >= 2;
}

function updateRanking() {
    rankingTable.innerHTML = '';
    players.sort((a, b) => b.elo - a.elo);

    players.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.elo}</td>
        `;
        rankingTable.appendChild(row);
    });
}

function renderHistory() {
    gameHistoryList.innerHTML = '';
    gameHistory.forEach(game => {
        const item = document.createElement('li');
        item.innerHTML = `${game.player1} (${game.eloChange1}) ${game.score1}:${game.score2} ${game.player2} (${game.eloChange2})`;
        gameHistoryList.appendChild(item);
    });
}

// Automatyczne ładowanie danych JSON przy starcie
loadJsonData();
