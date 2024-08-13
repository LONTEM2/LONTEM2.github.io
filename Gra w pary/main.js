console.log("test"); //sprawdzasz, czy main.js został poprawnie podłączony
setIdToTiles(); //przypisujesz każdej komórce id
var tilesPlacement = getRandomPlacement(); //losujesz położenie 32 par na 64 kafelkach
let validTiles = []; //tablica zawierająca wszystkie poprawnie odsłonięte kafelki
let isFirstClicked = false; //informuje, czy pierwszy kafelek został już zaznaczony
let lock = false; //blokuje zaznaczenie na czas sprawdzania poprawności pary
let firstTileId; //przechowuje id pierwszego zaznaczonego kafelka
let secondTileId; //przechowuje id drugiego zaznaczonego kafelka

function setIdToTiles() {
    let items = document.getElementsByTagName("td"); //pobranie wszystkich elementów <td> z html
    let id = 0;
    Array.from(items).forEach(item => { //dla każdego z <td> przypisujemy id np. <td id="0">
        item.id = id; 
        id++; // id zwiększa się o 1
    })
}

function getRandomPlacement() {
    let array = []; //tablica przechowująca wylosowane numery
    let numToChoose = []; // lista numerów do wylosowania
    for(let i = 1; i <= 32; i++) { //tworzenie 32 par numerów do wylosowania
        numToChoose.push(i);
        numToChoose.push(i);
    }
    for(let i = 0; i < 64; i++) { //proces losowania
        let chosenNum = getRandomInt(0,numToChoose.length); // wybieranie losowej liczby od 0 do ilości elementów w tablicy
        array[i] = numToChoose[chosenNum]; //przypisywanie losowego numeru do tablicy
        numToChoose.splice(chosenNum, 1); //usuwanie wylosowanego numeru z puli
    }
    return array;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min; //zwraza losowy numer od min do max -1 
}

function tileClick(tile) {
    if(lock) { //blokada stosowana podczas sprawdzania poprawności zaznaczenia pary
        return;
    }
    if(validTiles.includes(tile.id)) { //sprawdzenie, czy element został już poprawnie odkryty
        return;
    }
    if(firstTileId == tile.id) { //sprawdzenie, czy element został już przypisany do pierwszego kafelka
        return;
    }
    tile.classList.add("tileClicked"); //dodawanie nowej klasy (innego tła) do kafelka
    createImgSrc(tile,parseInt(tile.id));  //dodawanie odpowiedniego zdjecia do kafelka
    if(isFirstClicked) { //sprawdzenie, czy pierwszy kafelek został już kliknięty
        secondTileId = tile.id; //przypisanie id kafelka
        blockAndCheck(); //funkcja blokująca zaznaczanie i sprawdzenie poprawności zaznaczenia
        isFirstClicked = false; //wyzerowanie opcji
    }
    else {
        firstTileId = tile.id; //przypisanie id kafelka
        isFirstClicked = true;
    }
}

function createImgSrc(ele, num) {
    let img = document.createElement("img"); //tworzenie <img>
    img.src = "icons/" + tilesPlacement[num] + ".png"; //przypisywanie src="idObrazka.png"
    img.style.height = "60px"; //ustalanie wysokości obrazka na 60 pikseli
    ele.appendChild(img); //dodawania obrazka do kafelka
}

function blockAndCheck() {
    lock = true; //blokada możliwości zaznaczenia
    setTimeout(function (){ //w środku piszesz co ma się stać po tym czasie
        verifyTiles(); //weryfikacja kafelków
        lock = false; //odblokowanie możliwości zaznaczenia
        firstTileId = null; //usunięcie id kafelków - bez tego nie mozna zaznaczyc 1 kafelka
        secondTileId = null;
      }, 500); //ile czasu funkcja czeka
}
function verifyTiles() {
    let firstEle = document.getElementById(firstTileId); //pobranie 1 td po id
    let secondEle = document.getElementById(secondTileId); //pobranie 2 td po id
    if(tilesPlacement[parseInt(firstTileId)] == tilesPlacement[parseInt(secondTileId)]) { //sprawdzenie, czy obrazy się zgadzają
        validTiles.push(firstTileId); //dodanie elementów do validTiles
        validTiles.push(secondTileId);
    }
    else {
        firstEle.classList.remove("tileClicked"); //usunięcie klasy zapewniającej tło 
        secondEle.classList.remove("tileClicked"); //usunięcie klasy zapewniającej tło 
        firstEle.removeChild(firstEle.children.item(0)); //usunięcie obrazka z komórki
        secondEle.removeChild(secondEle.children.item(0)); //usunięcie obrazka z komórki
    }
}
