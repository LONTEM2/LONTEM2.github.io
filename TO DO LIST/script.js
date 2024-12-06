let zadania = [];

function wczytaj()
{
    console.log("wczytuje");
}

function zapisz()
{
    console.log("zapisuje");
}
let licznik = 0;



function usun(id)
{
    
    let sekcja = document.getElementById(id);
    sekcja.remove();
    

}
function zaznacz() //do poprawy bo nie działa jak chce
{
    let sekcja = document.getElementById("sekcja");
    sekcja.innerHTML = '<h1>Tytuł</h1>Opis tak długi ile mu miejsca starczy i tak dalej i tak dalej <button id="edytuj" onclick="edytuj()"><i class="fa-solid fa-pen"></i></button><button id="usun" onclick="usun()"><i class="fa-solid fa-trash"></i></button> <button id="odznacz" onclick="odznacz()"><i class="fa-solid fa-circle-check"></i></button>';
}
function dodaj()
{
    pokaz();
    
}
function pokaz() {
    
    document.getElementById('edytujj').style.display = 'block';
    
}

function schowaj() {
    
    document.getElementById('edytujj').style.display = 'none';
    const inputText = document.getElementById('input').value;
    const textareaText = document.getElementById('txtarea').value;
    localStorage.setItem('Tytul', inputText);
    localStorage.setItem('Opis', textareaText);
    console.log(localStorage.getItem('Opis'));
    console.log(localStorage.getItem('Tytul'));
    utworz();
}

function utworz() 
{
    
    licznik++;
    const nowyDiv = document.createElement('section');
    nowyDiv.id = 'Task-'+licznik;
    nowyDiv.className = 'sekcja';
    nowyDiv.innerHTML = '<h2>'+localStorage.getItem('Tytul')+'</h2>'+localStorage.getItem('Opis')+'<button id="edytuj" onclick="edytuj()"><i class="fa-solid fa-pen"></i></button><button id="usun" onclick="usun()"><i class="fa-solid fa-trash"></i></button> <button id="odznacz" onclick="odznacz()"><i class="fa-solid fa-circle-check"></i></button>';
    document.getElementById('kwadrat').appendChild(nowyDiv);
}