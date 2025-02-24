// script.js
const rankingTable = document.querySelector('#ranking-table tbody');
const addPlayerForm = document.getElementById('add-player-form');
const gameHistoryForm = document.getElementById('game-history-form');
const gameHistoryList = document.getElementById('game-history-list');

let players = JSON.parse(localStorage.getItem('players')) || [];
let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];

const adminPanel = document.getElementById('admin-panel');
adminPanel.style.display = 'none';

const adminLoginBtn = document.getElementById('admin-login');
const encodedPassword = 'WFNLZGZsc0FGa3Nsc2ZsZHNTbHNMc2xzYXM=';

adminLoginBtn.addEventListener('click', () => {
    const password = prompt('Podaj hasło administratora:');
    const decodedPassword = atob(encodedPassword);

    if (password === decodedPassword) {
        adminPanel.style.display = 'block'; 
    } else {
        alert('Błędne hasło!');
    }
});

addPlayerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('player-name').value.trim();
    const elo = parseInt(document.getElementById('player-elo').value, 10);

    if (players.some(player => player.name === name)) {
        alert('Gracz o tej nazwie już istnieje!');
        return;
    }

    if (name && !isNaN(elo)) {
        players.push({ name, elo });
        saveData();
        updateRanking();
        addPlayerForm.reset();
    } else {
        alert('Podaj poprawne dane gracza!');
    }
});

gameHistoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const player1 = document.getElementById('game-player1').value.trim();
    const player2 = document.getElementById('game-player2').value.trim();
    const score1 = parseInt(document.getElementById('game-score1').value, 10);
    const score2 = parseInt(document.getElementById('game-score2').value, 10);

    if (player1 && player2 && validScore(score1, score2)) {
        const [eloChange1, eloChange2] = calculateElo(player1, player2, score1, score2);
        const p1 = players.find(p => p.name === player1);
        const p2 = players.find(p => p.name === player2);

        if (p1 && p2) {
            p1.elo += eloChange1;
            p2.elo += eloChange2;

            gameHistory.unshift({ player1, player2, score1, score2, eloChange1, eloChange2 });
            saveData();
            updateRanking();
            renderHistory();
        } else {
            alert('Nie znaleziono jednego z graczy.');
        }
    } else {
        alert('Nieprawidłowy wynik! (Musi być do 11 i przewaga 2 pkt)');
    }
});

function calculateElo(player1, player2, score1, score2) {
    const p1 = players.find(p => p.name === player1);
    const p2 = players.find(p => p.name === player2);
    const scoreDiff = Math.abs(score1 - score2);

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
        if (index < 6) row.classList.add('blue-rank');
        else if (index < 10) row.classList.add('orange-rank');

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

function saveData() {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
}

updateRanking();
renderHistory();
