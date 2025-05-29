const canvas = document.getElementById('roulette-bar');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const freeZetonyBtn = document.getElementById('free-zetony-btn');
const betAmountInput = document.getElementById('bet-amount');
const betColorSelect = document.getElementById('bet-color');
const coinsSpan = document.getElementById('coins');
const resultDiv = document.getElementById('result');

const COINS_STORAGE_KEY = 'roulette_zetony';
const RESCUE_TIME_KEY = 'roulette_last_rescue_time';
const RESCUE_USED_KEY = 'roulette_rescue_used';

let zetony = 200;
let lastRescueTime = 0;
let rescueUsed = false;

// Load żetony from localStorage
if (localStorage.getItem(COINS_STORAGE_KEY) !== null) {
    zetony = parseInt(localStorage.getItem(COINS_STORAGE_KEY));
    if (isNaN(zetony)) zetony = 200;
}
// Load last rescue time from localStorage
if (localStorage.getItem(RESCUE_TIME_KEY) !== null) {
    lastRescueTime = parseInt(localStorage.getItem(RESCUE_TIME_KEY));
    if (isNaN(lastRescueTime)) lastRescueTime = 0;
}
// Load rescueUsed from localStorage
if (localStorage.getItem(RESCUE_USED_KEY) !== null) {
    rescueUsed = localStorage.getItem(RESCUE_USED_KEY) === 'true';
}

coinsSpan.textContent = zetony;
document.getElementById('balance').innerHTML = `Saldo: <span id="coins">${zetony}</span> żetonów`;

const colors = [
    { color: 'green', label: 'Zielone', ratio: 10 },
    { color: 'red', label: 'Czerwone', ratio: 2 },
    { color: 'black', label: 'Czarne', ratio: 2 },
    { color: 'red', label: 'Czerwone', ratio: 2 },
    { color: 'black', label: 'Czarne', ratio: 2 },
    { color: 'red', label: 'Czerwone', ratio: 2 },
    { color: 'black', label: 'Czarne', ratio: 2 },
    { color: 'red', label: 'Czerwone', ratio: 2 },
    { color: 'black', label: 'Czarne', ratio: 2 },
    { color: 'red', label: 'Czerwone', ratio: 2 },
    { color: 'black', label: 'Czarne', ratio: 2 },
    { color: 'red', label: 'Czerwone', ratio: 2 },
    { color: 'black', label: 'Czarne', ratio: 2 },
    { color: 'red', label: 'Czerwone', ratio: 2 },
    { color: 'black', label: 'Czarne', ratio: 2 }
];

const BAR_WIDTH = 600;
const BAR_HEIGHT = 60;
const SECTOR_COUNT = colors.length;
const SECTOR_WIDTH = BAR_WIDTH / 7; // pokazywanych 7 pól na pasku
const VISIBLE_SECTORS = 7;

function drawBar(offsetSector, offsetPx) {
    ctx.clearRect(0, 0, BAR_WIDTH, BAR_HEIGHT);
    let startX = -offsetPx;
    for (let i = 0; i <= VISIBLE_SECTORS; i++) {
        const idx = (offsetSector + i) % SECTOR_COUNT;
        // Draw sector
        ctx.fillStyle = colors[idx].color;
        ctx.fillRect(startX + i * SECTOR_WIDTH, 0, SECTOR_WIDTH, BAR_HEIGHT);
        // Draw label
        ctx.fillStyle = "#fff";
        ctx.font = "18px Segoe UI";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(colors[idx].label, startX + i * SECTOR_WIDTH + SECTOR_WIDTH / 2, BAR_HEIGHT / 2);
        // Draw border
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 2;
        ctx.strokeRect(startX + i * SECTOR_WIDTH, 0, SECTOR_WIDTH, BAR_HEIGHT);
    }
    // Draw indicator line (center)
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(BAR_WIDTH / 2, 0);
    ctx.lineTo(BAR_WIDTH / 2, BAR_HEIGHT);
    ctx.stroke();
}

// Initial
drawBar(0, 0);

let spinning = false;
let sectorOffset = 0;
let pxOffset = 0;

function updateCoinsDisplay() {
    coinsSpan.textContent = zetony;
    document.getElementById('balance').innerHTML = `Saldo: <span id="coins">${zetony}</span> żetonów`;
    localStorage.setItem(COINS_STORAGE_KEY, zetony);
}

function saveRescueTime() {
    localStorage.setItem(RESCUE_TIME_KEY, lastRescueTime);
}

function saveRescueUsed() {
    localStorage.setItem(RESCUE_USED_KEY, rescueUsed ? 'true' : 'false');
}

// Dodaj przycisk ratunkowy (pokazuje się tylko na końcu gry, NIE klikaj go ręcznie, nie dotyczy "Darmowe żetony")
let rescueBtn = document.createElement("button");
rescueBtn.innerText = "Dodaj ratunkowe 10 żetonów";
rescueBtn.style.marginTop = "10px";
rescueBtn.style.display = "none";
rescueBtn.onclick = function() {
    // Nie można dodać żetonów po odświeżeniu strony!
    if (rescueUsed) {
        resultDiv.innerHTML = `<span style="color:orange">Nie możesz już dodać ratunkowych żetonów po odświeżeniu strony.</span>`;
        rescueBtn.style.display = "none";
        return;
    }
    let now = Date.now();
    if (now - lastRescueTime < 2 * 60 * 1000) {
        let left = Math.ceil((2 * 60 * 1000 - (now - lastRescueTime)) / 1000);
        resultDiv.innerHTML = `<span style="color:orange">Ratunkowe żetony można dodać co 2 minuty.<br>Odczekaj jeszcze ${left} sekund.</span>`;
        return;
    }
    zetony += 10;
    updateCoinsDisplay();
    lastRescueTime = now;
    rescueUsed = true;
    saveRescueTime();
    saveRescueUsed();
    resultDiv.innerHTML = `<span style="color:lime">Dodano ratunkowe 10 żetonów!</span>`;
    rescueBtn.style.display = "none";
    spinBtn.disabled = false;
};
document.querySelector(".container").appendChild(rescueBtn);

// Przycisk "Darmowe żetony" - daje 5 żetonów co 5 minut, nie działa jeśli gracz już kliknął po odświeżeniu strony
const FREE_ZETONY_TIME_KEY = 'roulette_last_free_zetony_time';
let lastFreeZetonyTime = 0;
if (localStorage.getItem(FREE_ZETONY_TIME_KEY) !== null) {
    lastFreeZetonyTime = parseInt(localStorage.getItem(FREE_ZETONY_TIME_KEY));
    if (isNaN(lastFreeZetonyTime)) lastFreeZetonyTime = 0;
}
freeZetonyBtn.onclick = function() {
    let now = Date.now();
    const cooldown = 5 * 60 * 1000; // 5 minut
    if (now - lastFreeZetonyTime < cooldown) {
        let left = Math.ceil((cooldown - (now - lastFreeZetonyTime)) / 1000);
        resultDiv.innerHTML = `<span style="color:orange">Darmowe żetony dostępne za ${left} sekund.</span>`;
        return;
    }
    zetony += 5;
    updateCoinsDisplay();
    lastFreeZetonyTime = now;
    localStorage.setItem(FREE_ZETONY_TIME_KEY, lastFreeZetonyTime);
    resultDiv.innerHTML = `<span style="color:lime">Dodano 5 darmowych żetonów!</span>`;
};

spinBtn.onclick = async function () {
    if (spinning) return;
    let bet = parseInt(betAmountInput.value);
    if (isNaN(bet) || bet <= 0) {
        resultDiv.textContent = "Podaj poprawną kwotę zakładu!";
        return;
    }
    if (bet > zetony) {
        resultDiv.textContent = "Nie masz tylu żetonów!";
        return;
    }
    let chosenColor = betColorSelect.value;
    spinning = true;
    spinBtn.disabled = true;
    freeZetonyBtn.disabled = true;
    resultDiv.textContent = "";

    // Najpierw losujemy wynik!
    const winIndex = Math.floor(Math.random() * SECTOR_COUNT);
    startAudio();

    // Oblicz ile musimy przesunąć, by wygrany sektor trafił pod wskaźnik
    // Chcemy, by winIndex był na środku: czyli środek widoku to sektor: centerIdx
    let centerIdx = (sectorOffset + Math.floor((BAR_WIDTH / 2 + pxOffset) / SECTOR_WIDTH)) % SECTOR_COUNT;
    let rounds = 4;
    let moveSectors = rounds * SECTOR_COUNT + ((winIndex - centerIdx + SECTOR_COUNT) % SECTOR_COUNT);
    let totalPx = moveSectors * SECTOR_WIDTH - pxOffset;
    let duration = 3200 + Math.random() * 500;
    let start = null;

    function animate(ts) {
        if (!start) start = ts;
        let progress = (ts - start) / duration;
        if (progress > 1) progress = 1;
        // Ease out
        let eased = 1 - Math.pow(1 - progress, 2.7);
        let currPx = pxOffset + eased * totalPx;
        let sectorsPassed = Math.floor(currPx / SECTOR_WIDTH);
        let pxInSector = currPx % SECTOR_WIDTH;
        drawBar((sectorOffset + sectorsPassed) % SECTOR_COUNT, pxInSector);
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Ustaw na końcu (dokładnie pod wskaźnikiem)
            sectorOffset = (sectorOffset + sectorsPassed) % SECTOR_COUNT;
            pxOffset = pxInSector;
            drawBar(sectorOffset, pxOffset);
            endSpin(winIndex, chosenColor, bet);
        }
    }
    requestAnimationFrame(animate);

    function endSpin(winIndex, chosenColor, bet) {
        const sector = colors[winIndex];
        let win = false;
        let winZetony = 0;
        if (sector.color === chosenColor) {
            winAudio();
            win = true;
            winZetony = bet * sector.ratio;
            zetony += winZetony;
            resultDiv.innerHTML = `<span style="color:lime">Wygrana! Wylosowano: <b>${sector.label}</b> (+${winZetony} żetonów)</span>`;
        } else {
            zetony -= bet;
            resultDiv.innerHTML = `<span style="color:#ff4444">Przegrana! Wylosowano: <b>${sector.label}</b> (-${bet} żetonów)</span>`;
        }
        updateCoinsDisplay();
        spinning = false;
        spinBtn.disabled = false;
        freeZetonyBtn.disabled = false;
        // Ratunkowe żetony jeśli gracz ma 0 lub mniej
        if (zetony <= 0) {
            let now = Date.now();
            if (!rescueUsed) {
                if (now - lastRescueTime >= 2 * 60 * 1000) {
                    rescueBtn.style.display = "inline-block";
                    resultDiv.innerHTML += `<br><span style="color:orange">Koniec gry! Kliknij przycisk poniżej, aby dostać ratunkowe 10 żetonów i spróbować dalej.</span>`;
                } else {
                    let left = Math.ceil((2 * 60 * 1000 - (now - lastRescueTime)) / 1000);
                    rescueBtn.style.display = "inline-block";
                    resultDiv.innerHTML += `<br><span style="color:orange">Koniec gry! Ratunkowe żetony będą dostępne za ${left} sekund.</span>`;
                    spinBtn.disabled = true;
                }
            } else {
                rescueBtn.style.display = "none";
                resultDiv.innerHTML += `<br><span style="color:orange">Koniec gry! Ratunkowe żetony będą dostępne za ${left} sekund</span>`;
                spinBtn.disabled = true;
            }
        } else {
            rescueBtn.style.display = "none";
        }
    }
}
function startAudio() {
    var audio = new Audio('/assets/gamblingstart.mp3');
    audio.volume = 0.2;
    audio.play();
}
function winAudio() {
    var audio = new Audio('/assets/lets-go-gambling-win.mp3');
    audio.volume = 0.2;
    audio.play();
}