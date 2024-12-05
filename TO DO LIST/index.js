function wczytaj()
{
    console.log("wczytuje");
}

function zapisz()
{
    console.log("zapisuje");
}
let licznik = 0;

document.getElementById('dodawanie').addEventListener('click', function() {
    licznik++;
    const nowyDiv = document.createElement('section');
    nowyDiv.className = 'Task-'+licznik;
    nowyDiv.id = 'sekcja';
    nowyDiv.innerHTML = '<h1>Tytuł</h1>Opis tak długi ile mu miejsca starczy i tak dalej i tak dalej <button id="edytuj" onclick="edytuj()"><i class="fa-solid fa-pen"></i></button><button id="usun" onclick="usun()"><i class="fa-solid fa-trash"></i></button><button id="zaznacz" onclick="zaznacz()"><i class="fa-regular fa-circle-check"></i></button>';
    document.getElementById('kwadrat').appendChild(nowyDiv);
});

function usun()
{
    let sekcja = document.getElementById("sekcja");
    sekcja.remove();

}
function zaznacz() //do poprawy bo nie działa jak chce
{
    let sekcja = document.getElementById("sekcja");
    sekcja.innerHTML = '<h1>Tytuł</h1>Opis tak długi ile mu miejsca starczy i tak dalej i tak dalej <button id="edytuj" onclick="edytuj()"><i class="fa-solid fa-pen"></i></button><button id="usun" onclick="usun()"><i class="fa-solid fa-trash"></i></button> <button id="odznacz" onclick="odznacz()"><i class="fa-solid fa-circle-check"></i></button>';
}
