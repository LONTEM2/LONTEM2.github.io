let notatka = [];
let licznik = 0;
let licznik2 = 0;

window.addEventListener('load', () => {
    const savedNotatki = localStorage.getItem('notatki');
    if (savedNotatki) {
        notatka = JSON.parse(savedNotatki);
        notatka.forEach((n, index) => {
            utworzElementNotatki(n, index);
        });
        licznik = notatka.length;
    }
});


function zapisz() {

    localStorage.setItem('notatki', JSON.stringify(notatka));

    const blob = new Blob([JSON.stringify(notatka, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "notatka-"+licznik2+".json";
    licznik2++;
    link.click();
}

function wczytaj() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', () => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = JSON.parse(event.target.result);
                if (Array.isArray(data)) {
                    notatka = data;
                    document.getElementById('kwadrat').innerHTML = ''; // Usuwanie poprzednich tasków
                    odswiezSekcje();
                    data.forEach((n, index) => {
                        utworzElementNotatki(n, index);
                    });
                    licznik = notatka.length;
                }
            };
            reader.readAsText(file);
        }
    });

    input.click();
}

document.getElementById('wczytaj').addEventListener('click', wczytaj);



function usun(id) {
    const sekcja = document.getElementById(id);
    const index = parseInt(id.split('-')[1], 10);
    notatka.splice(index, 1);
    sekcja.remove();
    odswiezSekcje();
    localStorage.setItem('notatki', JSON.stringify(notatka)); 
    var audio = new Audio('/assets/remove.wav');
    audio.volume = 0.2;
    audio.play();
}

function dodaj() {
    document.getElementById('edytujj').style.display = 'block';
}

function schowaj() {
    document.getElementById('edytujj').style.display = 'none';
    const inputText = document.getElementById('input').value;
    const textareaText = document.getElementById('txtarea').value;

    if (!inputText.trim() || !textareaText.trim()) {
        playAlert();
        return;
    }

    const nowaNotatka = { Tytul: inputText, Opis: textareaText, zaznaczone: false };
    notatka.push(nowaNotatka);
    utworzElementNotatki(nowaNotatka, notatka.length - 1);
    edytowane_D();

    // Zapisz zmiany w localStorage
    localStorage.setItem('notatki', JSON.stringify(notatka));
}

function edytuj() {
    aktualnaSekcjaId = this.closest('section').id;
    const index = parseInt(aktualnaSekcjaId.split('-')[1], 10);
    const { Tytul, Opis } = notatka[index];

    document.getElementById('input2').value = Tytul;
    document.getElementById('txtarea2').value = Opis;
    pokaz2();
}

function schowaj2() {
    document.getElementById('zmien').style.display = 'none';
    const inputText = document.getElementById('input2').value;
    const textareaText = document.getElementById('txtarea2').value;

    if (!inputText.trim() || !textareaText.trim()) {
        playAlert();
        return;
    }

    const index = parseInt(aktualnaSekcjaId.split('-')[1], 10);
    notatka[index] = { ...notatka[index], Tytul: inputText, Opis: textareaText };
    const sekcja = document.getElementById(aktualnaSekcjaId);
    sekcja.querySelector('.Tytul1').textContent = inputText;
    sekcja.querySelector('.opis1').textContent = textareaText;

    aktualnaSekcjaId = null;
    edytowane_D();

    // Zapisz zmiany w localStorage
    localStorage.setItem('notatki', JSON.stringify(notatka));
}

function zaznacz(id) {
    const sekcja = document.getElementById(id);
    const index = parseInt(id.split('-')[1], 10);
    const przycisk = sekcja.querySelector('#zaznacz i');

    notatka[index].zaznaczone = !notatka[index].zaznaczone;

    if (notatka[index].zaznaczone) {
        sekcja.classList.add('zaznaczone');
        przycisk.classList.replace('fa-regular', 'fa-solid');
        przycisk.classList.replace('fa-circle-check', 'fa-check-circle');
        gotowe();
    } else {
        sekcja.classList.remove('zaznaczone');
        przycisk.classList.replace('fa-solid', 'fa-regular');
        przycisk.classList.replace('fa-check-circle', 'fa-circle-check');
    }

    // Zapisz zmiany w localStorage
    localStorage.setItem('notatki', JSON.stringify(notatka));
}

function utworzElementNotatki(notatka, index) {
    licznik++;
    const nowyDiv = document.createElement('section');
    nowyDiv.id = 'Task-' + index;
    nowyDiv.className = 'sekcja';
    if (notatka.zaznaczone) nowyDiv.classList.add('zaznaczone');
    document.getElementById('kwadrat').appendChild(nowyDiv);

    let naglowek = document.createElement('h2');
    naglowek.className = 'Tytul1';
    naglowek.textContent = notatka.Tytul;
    nowyDiv.appendChild(naglowek);

    let opis = document.createElement('p');
    opis.className = 'opis1';
    opis.textContent = notatka.Opis;
    nowyDiv.appendChild(opis);

    let przyciskiDiv = document.createElement('div');
    przyciskiDiv.className = 'przyciski';
    nowyDiv.appendChild(przyciskiDiv);

    let przycisk1 = document.createElement('button');
    przycisk1.id = 'edytuj';
    przycisk1.addEventListener('click', edytuj);
    przyciskiDiv.appendChild(przycisk1);
    let p1 = document.createElement('i');
    p1.classList.add('fa-solid', 'fa-pen');
    przycisk1.appendChild(p1);

    let przycisk2 = document.createElement('button');
    przycisk2.id = 'usun';
    przycisk2.addEventListener('click', function () {
        usun(nowyDiv.id);
    });
    przyciskiDiv.appendChild(przycisk2);
    let p2 = document.createElement('i');
    p2.classList.add('fa-solid', 'fa-trash');
    przycisk2.appendChild(p2);

    let przycisk3 = document.createElement('button');
    przycisk3.id = 'zaznacz';
    przycisk3.addEventListener('click', function () {
        zaznacz(nowyDiv.id);
    });
    przyciskiDiv.appendChild(przycisk3);
    let p3 = document.createElement('i');
    p3.classList.add('fa-regular', 'fa-circle-check');
    przycisk3.appendChild(p3);
}

function odswiezSekcje() {
    const sekcje = document.querySelectorAll('.sekcja');
    sekcje.forEach((sekcja, index) => {
        sekcja.id = 'Task-' + index;
    });
}

function pokaz2() {
    document.getElementById('zmien').style.display = 'block';
}

function playAlert() {
    Swal.fire({
        title: 'Tytuł i opis są wymagane!',
        text: 'Wprowadź poprawne dane!',
        icon: 'error',
        confirmButtonText: 'OK',
    });
    var audio = new Audio('/assets/error.mp3');
    audio.volume = 1;
    audio.play();
}

function gotowe() {
    var audio = new Audio('/assets/add-points.mp3');
    audio.volume = 1;
    audio.play();
}

function edytowane_D() {
    var audio = new Audio('/assets/edit.wav');
    audio.volume = 1;
    audio.play();
}

// Zmiana: zapisz() jest teraz wywoływane po kliknięciu w przycisk
document.getElementById('zapiszPrzycisk').addEventListener('click', zapisz);