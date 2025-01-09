// Zmienne do przechowywania stanu gry
let lontem = localStorage.getItem('lontem') ? parseFloat(localStorage.getItem('lontem')) : 0;
let clickPower = localStorage.getItem('clickPower') ? parseFloat(localStorage.getItem('clickPower')) : 1;
let upgradeCost = localStorage.getItem('upgradeCost') ? parseFloat(localStorage.getItem('upgradeCost')) : 50;
let autoClickers = localStorage.getItem('autoClickers') ? parseFloat(localStorage.getItem('autoClickers')) : 0;
let autoClickerPower = localStorage.getItem('autoClickerPower') ? parseFloat(localStorage.getItem('autoClickerPower')) : 0.1;
let helpCost = localStorage.getItem('helpCost') ? parseFloat(localStorage.getItem('helpCost')) : 100;
let easyAutoCost = localStorage.getItem('easyAutoCost') ? parseFloat(localStorage.getItem('easyAutoCost')) : 1000;
let mediumAutoCost = localStorage.getItem('mediumAutoCost') ? parseFloat(localStorage.getItem('mediumAutoCost')) : 2000;
let advancedAutoCost = localStorage.getItem('advancedAutoCost') ? parseFloat(localStorage.getItem('advancedAutoCost')) : 5000;

// Zmienna do aktualizacji UI
const lontemDisplay = document.getElementById('lontem');
const lpsDisplay = document.getElementById('lps');
const clickPowerDisplay = document.getElementById('clickPower');
const upgradeCostDisplay = document.getElementById('upgradeCost');
const helpCostDisplay = document.getElementById('helpCost');
const easyAutoCostDisplay = document.getElementById('easyAutoCost');
const mediumAutoCostDisplay = document.getElementById('mediumAutoCost');
const advancedAutoCostDisplay = document.getElementById('advancedAutoCost');
const largeL = document.getElementById('largeL');
const upgradeButton = document.getElementById('upgradeButton');
const buyHelpButton = document.getElementById('buyHelp');
const buyEasyAutoButton = document.getElementById('buyEasyAuto');
const buyMediumAutoButton = document.getElementById('buyMediumAuto');
const buyAdvancedAutoButton = document.getElementById('buyAdvancedAuto');
const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');
const resumeButton = document.getElementById('resumeButton');
const exitButton = document.getElementById('exitButton');

// Funkcja do zaokrąglania dużych liczb
function formatNumber(number) {
    return number.toFixed(3);  // Zaokrąglamy do 3 miejsc po przecinku
}

// Funkcja do aktualizacji wyników na stronie
function updateGame() {
    lontemDisplay.textContent = formatNumber(lontem);
    lpsDisplay.textContent = formatNumber(autoClickers * autoClickerPower) + " L/s";
    clickPowerDisplay.textContent = clickPower;
    upgradeCostDisplay.textContent = formatNumber(upgradeCost);
    helpCostDisplay.textContent = formatNumber(helpCost);
    easyAutoCostDisplay.textContent = formatNumber(easyAutoCost);
    mediumAutoCostDisplay.textContent = formatNumber(mediumAutoCost);
    advancedAutoCostDisplay.textContent = formatNumber(advancedAutoCost);
    
    // Zapisz stan gry w localStorage
    localStorage.setItem('lontem', lontem);
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('upgradeCost', upgradeCost);
    localStorage.setItem('autoClickers', autoClickers);
    localStorage.setItem('autoClickerPower', autoClickerPower);
    localStorage.setItem('helpCost', helpCost);
    localStorage.setItem('easyAutoCost', easyAutoCost);
    localStorage.setItem('mediumAutoCost', mediumAutoCost);
    localStorage.setItem('advancedAutoCost', advancedAutoCost);
}

// Funkcja do kliknięcia i zdobywania LONTEM
largeL.addEventListener('click', () => {
    lontem += clickPower;
    updateGame();
});

// Funkcja do ulepszania mocy kliknięcia
upgradeButton.addEventListener('click', () => {
    if (lontem >= upgradeCost) {
        lontem -= upgradeCost;
        clickPower *= 1.8;  // Zwiększenie mocy kliknięcia w sposób płynny
        upgradeCost = Math.floor(upgradeCost * 1.4);  // Wzrost ceny ulepszenia jest coraz bardziej stromy
        updateGame();
    }
});

// Funkcja do kupowania Pomocy kolegi
buyHelpButton.addEventListener('click', () => {
    if (lontem >= helpCost) {
        lontem -= helpCost;
        autoClickers += 0.1;
        helpCost = Math.floor(helpCost * 1.4); // Koszt rośnie w sposób wykładniczy, ale powoli
        updateGame();
    }
});

// Funkcja do kupowania prostego autoclickera
buyEasyAutoButton.addEventListener('click', () => {
    if (lontem >= easyAutoCost) {
        lontem -= easyAutoCost;
        autoClickers += 0.2;
        easyAutoCost = Math.floor(easyAutoCost * 1.4); // Zwiększenie ceny prostego autoclickera
        updateGame();
    }
});

// Funkcja do kupowania średniego autoclickera
buyMediumAutoButton.addEventListener('click', () => {
    if (lontem >= mediumAutoCost) {
        lontem -= mediumAutoCost;
        autoClickers += 0.5;
        mediumAutoCost = Math.floor(mediumAutoCost * 1.4); // Zwiększenie ceny średniego autoclickera
        updateGame();
    }
});

// Funkcja do kupowania zaawansowanego autoclickera
buyAdvancedAutoButton.addEventListener('click', () => {
    if (lontem >= advancedAutoCost) {
        lontem -= advancedAutoCost;
        autoClickers += 1;
        advancedAutoCost = Math.floor(advancedAutoCost * 1.4); // Zwiększenie ceny zaawansowanego autoclickera
        updateGame();
    }
});

// Automatyczne zdobywanie LONTEM dzięki automatycznym klikaczom
setInterval(() => {
    lontem += autoClickers * autoClickerPower;
    updateGame();
}, 1000);

// Menu
menuButton.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

resumeButton.addEventListener('click', () => {
    menu.classList.add('hidden');
});

exitButton.addEventListener('click', () => {
    window.close();
});
