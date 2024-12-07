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

function edytuj()
{
    console.log("edytuj!!!");
}

function utworz() 
{
    
    licznik++;
    const nowyDiv = document.createElement('section');
    nowyDiv.id = 'Task-'+licznik;
    nowyDiv.className = 'sekcja';
    document.getElementById('kwadrat').appendChild(nowyDiv);

    let naglowek = document.createElement('h2');
    naglowek.textContent = localStorage.getItem('Tytul');
    nowyDiv.appendChild(naglowek);

    let opisDiv = document.createElement('div');
    opisDiv.className = 'opis-container';
    nowyDiv.appendChild(opisDiv);

    let opis = document.createElement('p');
    opis.textContent = localStorage.getItem('Opis');
    opisDiv.appendChild(opis);

    let przycisk1 = document.createElement('button');
    przycisk1.id = 'edytuj';
    przycisk1.addEventListener('click', edytuj);
    przycisk1.innerHTML = '<i class="fa-solid fa-pen"></i>';
    opisDiv.appendChild(przycisk1);

    let przycisk2 = document.createElement('button');
    przycisk2.id = 'usun';
    przycisk2.addEventListener('click', function() {
        usun(nowyDiv.id);
    });
    przycisk2.innerHTML = '<i class="fa-solid fa-trash"></i>';
    opisDiv.appendChild(przycisk2);

    let przycisk3 = document.createElement('button');
    przycisk3.id = 'zaznacz';
    przycisk3.addEventListener('click', zaznacz);
    przycisk3.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
    opisDiv.appendChild(przycisk3);

    
}
