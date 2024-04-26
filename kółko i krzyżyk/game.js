// let x = document.getElementById("X");
// x.style.display = "block";
if(localStorage.getItem("Nick1")==null)
{
    let x = "Gracz1";
    localStorage.setItem("Nick1",x);
}
if(localStorage.getItem("Nick2")==null)
{
    let x = "Gracz2";
    localStorage.setItem("Nick2",x);
}
if(localStorage.getItem("TypGracza2")==null)
{
    let x = "Gracz 2";
    localStorage.setItem("TypGracza2",x);
}
let isX = true;
let gameIsEnd = false;
let table = [["","",""],["","",""],["","",""]];
let figureCount = 0;
wgrajFunkcjedoPol();
WczytywanieNicku();
WczytywanieNicku2();
ChangeShadow();
function wgrajFunkcjedoPol() {
    let pola1 = document.getElementsByClassName("pole1");
    let pola2 = document.getElementsByClassName("pole2");
    let pola3 = document.getElementsByClassName("pole3");
    for(let i = 0; i < pola1.length;i++) {
        pola1[i].addEventListener("click",() => funkcjaPola(pola1[i],i,0));
    }
    for(let i = 0; i < pola2.length;i++) {
        pola2[i].addEventListener("click",() => funkcjaPola(pola2[i],i,1));
    }
    for(let i = 0; i < pola3.length;i++) {
        pola3[i].addEventListener("click",() => funkcjaPola(pola3[i],i,2));
    }
}
function funkcjaPola(pole,rzad,kolumna) {
    if(gameIsEnd) {
        return;
    }
    let figure;
    if(table[rzad][kolumna] != "") {
        return;
    }
    if(isX) {
        figure = pole.children[0];
        table[rzad][kolumna] = "X";
        sprawdzZasady(rzad,kolumna);
        isX = !isX;
    }
    else  {
        figure = pole.children[1];
        table[rzad][kolumna] = "O";
        sprawdzZasady(rzad,kolumna);
        isX = !isX;
    }
    figure.style.display = "block";
    if(gameIsEnd) {
        SaveGame();
        endShadow();
        ChangeShadow();
    }
    else {
        ChangeShadow();
    }
    figureCount++;
    if(figureCount == 9) {
        drawMusic();
        SetWhiteShadow();
        SaveGame();
    }
}
function sprawdzZasady(rzad,kolumna) {
    if(table[rzad][0] == table[rzad][1] && table[rzad][0] == table[rzad][2]) {
        //console.log("hehe1");
        gameIsEnd = true;
        heheMan();
    }
    if(table[0][kolumna] == table[1][kolumna] && table[1][kolumna] == table[2][kolumna]) {
        //console.log("hehe2");
        gameIsEnd = true;
        heheMan();
    }
    if(table[0][0] == table[1][1] && table[1][1] == table[2][2] && table[1][1] != "") {
        //console.log("hehe3");
        gameIsEnd = true;
        heheMan();
    }
    if(table[0][2] == table[1][1] && table[1][1] == table[2][0] && table[1][1] != "") {
        //console.log("hehe4");
        gameIsEnd = true;
        heheMan();
    }
}
function endShadow() {
    if(table[rzad][0] == "X") {
        isX = true;
    }
    else {
        isX = false;
    }
}
function heheMan() {
    var audio = new Audio('/assets/crab.mp3');
    audio.volume = 0.2;
    audio.play();
}
function drawMusic() {
    var audio = new Audio('/assets/lego.mp3');
    audio.volume = 0.6;
    audio.play();
}
function WczytywanieNicku()
{
    let Nick1 = document.getElementById("Nickname1");
    Nick1.textContent = localStorage.getItem("Nick1");
    
}
function WczytywanieNicku2()
{

    let TypGracza2 = localStorage.getItem("TypGracza2");
    let Nick2 = localStorage.getItem("Nick2");
    let Nickname2 = document.getElementById("Nickname2");
    if(TypGracza2 == "Gracz 2")
    {
        Nickname2.textContent = Nick2;
    }
    else
    {
        Nickname2.textContent = TypGracza2;
    }

}
function ChangeShadow() {
    let glowneKolko = document.getElementById("glowneKolko");
    let glownyKrzyzyk = document.getElementById("glownyKrzyzyk");
    if(!isX) {
        glowneKolko.style.setProperty("filter", "drop-shadow(0 0 15px #00d0ff)");
        glownyKrzyzyk.style.removeProperty("filter");
    }
    else {
        glownyKrzyzyk.style.setProperty("filter", "drop-shadow(0 0 15px #ff0000)");
        glowneKolko.style.removeProperty("filter");
    }
}
function SetWhiteShadow() {
    let glowneKolko = document.getElementById("glowneKolko");
    let glownyKrzyzyk = document.getElementById("glownyKrzyzyk");
    glowneKolko.style.setProperty("filter", "drop-shadow(0 0 15px #ffffff)");
    glownyKrzyzyk.style.setProperty("filter", "drop-shadow(0 0 15px #ffffff)");
}
function SaveGame()
{
    let saves = localStorage.getItem("history");
    let stringToSave = generaterStringToSave();
    if(saves == null) {
        saves = stringToSave;
    }
    else {
        saves += stringToSave;
    }
    localStorage.setItem("history",saves);
}
function generaterStringToSave() {
    let string = "{";
    table.forEach(element => {
        element.forEach(cell => {
            if(cell == "") {
                cell = "-";
            }
            if(string == "{") {
                string += cell;
            }
            else {
                string += ", " + cell;
            }
        })
    });
    string += "}, \n";
    return string;
}