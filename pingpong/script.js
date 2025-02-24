document.addEventListener('DOMContentLoaded', () => {
    const rankingTable = document.querySelector('#ranking-table tbody');
    const gameHistoryList = document.getElementById('game-history-list');
    const loadJsonInput = document.getElementById('load-json');
    const saveJsonButton = document.getElementById('save-json');
    const gameHistoryForm = document.getElementById('game-history-form');
    const adminPanel = document.getElementById('admin-panel');
    const adminLoginBtn = document.getElementById('admin-login');

    let players = [];
    let gameHistory = [];

    // Hasło admina (zakodowane)
    const encodedPassword = 'WFNLZGZsc0FGa3Nsc2ZsZHNTbHNMc2xzYXM=';

    // Logowanie admina
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
    }

    // Wczytaj JSON z pliku lub Local Storage
    function loadJsonData() {
        const savedPlayers = localStorage.getItem('players');
        const savedHistory = localStorage.getItem('gameHistory');

        if (savedPlayers && savedHistory) {
            players = JSON.parse(savedPlayers);
            gameHistory = JSON.parse(savedHistory);
            updateRanking();
            renderHistory();
            console.log('Dane załadowane z Local Storage!');
        } else {
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
                    console.log('Dane załadowane z pliku JSON!');
                })
                .catch(error => console.error('Błąd:', error));
        }
    }

    // Wczytaj JSON przez admina
    loadJsonInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    players = data.players || [];
                    gameHistory = data.gameHistory || [];
                    saveToLocalStorage();
                    updateRanking();
                    renderHistory();
                    alert('Dane załadowane i zapisane lokalnie!');
                } catch (error) {
                    alert('Błąd wczytywania pliku JSON! Sprawdź format danych.');
                }
            };
            reader.readAsText(file);
        }
    });

    // Zapisz JSON
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
        alert('Dane zostały zapisane jako ranking.json!');
    });

    // Dodaj wynik do historii
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
            alert('Nieprawidłowy wynik! Gracz musi zdobyć minimum 11 punktów i przewagę 2.');
            return;
        }

        const [eloChange1, eloChange2] = calculateElo(player1, player2, score1, score2);

        gameHistory.push({ player1, player2, score1, score2, eloChange1, eloChange2 });

        updatePlayerElo(player1, eloChange1);
        updatePlayerElo(player2, eloChange2);

        updateRanking();
        renderHistory();
        saveToLocalStorage();
        gameHistoryForm.reset();
    });

    function saveToLocalStorage() {
        localStorage.setItem('players', JSON.stringify(players));
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    }

    function updatePlayerElo(name, change) {
        const player = players.find(p => p.name === name);
        if (player) player.elo += change;
    }

    function calculateElo(player1, player2, score1, score2) {
        const p1 = players.find(p => p.name === player1);
        const p2 = players.find(p => p.name === player2);
        if (!p1 || !p2) return [0, 0];

        const eloDiff = p2.elo - p1.elo;
        const kFactor = 32;

        const expectedScore1 = 1 / (1 + Math.pow(10, eloDiff / 400));
        const expectedScore2 = 1 - expectedScore1;

        return [
            Math.round(kFactor * (score1 > score2 ? 1 : 0 - expectedScore1 * kFactor)),
            Math.round(kFactor * (score2 > score1 ? 1 : 0 - expectedScore2 * kFactor))
        ];
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
});
