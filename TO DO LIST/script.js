let aktualnaSekcjaId = null;
let licznik = 0;

function wczytaj()
{
    console.log("wczytuje");
}

function zapisz()
{
    console.log("zapisuje");
}




function usun(id)
{
    let sekcja = document.getElementById(id);
    localStorage.removeItem(id + '-tytul');
    localStorage.removeItem(id + '-opis');
    sekcja.remove();
}
function zaznacz() //do poprawy bo nie działa jak chce
{
    let sekcja = document.getElementById("sekcja");
}
function dodaj()
{
    document.getElementById('edytujj').style.display = 'block';
    
}




function schowaj() {
    
    document.getElementById('edytujj').style.display = 'none';
    const inputText = document.getElementById('input').value;
    const textareaText = document.getElementById('txtarea').value;
    localStorage.setItem('Tytul', inputText);
    localStorage.setItem('Opis', textareaText);
    utworz();
}

function edytuj()
{
    aktualnaSekcjaId = this.closest('section').id;

    const tytul = localStorage.getItem(aktualnaSekcjaId + '-tytul');
    const opis = localStorage.getItem(aktualnaSekcjaId + '-opis');

    document.getElementById('input2').value = tytul;
    document.getElementById('txtarea2').value = opis;

    pokaz2();
}

function pokaz2()
{
    document.getElementById('zmien').style.display = 'block';
    
}

function schowaj2()
{
    

    document.getElementById('zmien').style.display = 'none';

    

    const inputText = document.getElementById('input2').value;
    const textareaText = document.getElementById('txtarea2').value;

    if (!inputText.trim() || !textareaText.trim()) {
        alert('Tytuł i opis są wymagane! Wprowadz poprawne dane!');
        return; 
    }
    
    if (aktualnaSekcjaId) {
        localStorage.setItem(aktualnaSekcjaId + '-tytul', inputText);
        localStorage.setItem(aktualnaSekcjaId + '-opis', textareaText);
    }
    if (aktualnaSekcjaId) {
        const sekcja = document.getElementById(aktualnaSekcjaId);
        const tytulElement = sekcja.querySelector('.Tytul1');
        const opisElement = sekcja.querySelector('.opis1');
        
        tytulElement.textContent = inputText;
        opisElement.textContent = textareaText;
    }

    aktualnaSekcjaId = null;
}


function utworz() 
{
    const sprtytul = localStorage.getItem('Tytul');
    const spropis = localStorage.getItem('Opis');
    if (!sprtytul.trim() || !spropis.trim()) {
        alert('Tytuł i opis są wymagane! Wprowadz poprawne dane!');
        return; 
    }

    licznik++;
    const nowyDiv = document.createElement('section');
    nowyDiv.id = 'Task-' + licznik;
    nowyDiv.className = 'sekcja';
    document.getElementById('kwadrat').appendChild(nowyDiv);

    let naglowek = document.createElement('h2');
    naglowek.className = 'Tytul1';
    naglowek.textContent = localStorage.getItem('Tytul');
    nowyDiv.appendChild(naglowek);

    let opis = document.createElement('p');
    opis.className = 'opis1';
    opis.textContent = localStorage.getItem('Opis');
    nowyDiv.appendChild(opis);

    localStorage.setItem(nowyDiv.id + '-tytul', localStorage.getItem('Tytul'));
    localStorage.setItem(nowyDiv.id + '-opis', localStorage.getItem('Opis'));

    let przyciskiDiv = document.createElement('div');
    przyciskiDiv.className = 'przyciski';
    nowyDiv.appendChild(przyciskiDiv);

    let przycisk1 = document.createElement('button');
    przycisk1.id = 'edytuj';
    przycisk1.addEventListener('click', edytuj);
    let p1 = document.createElement('i');
    p1.classList.add('fa-solid', 'fa-pen');
    przyciskiDiv.appendChild(przycisk1);
    przycisk1.appendChild(p1);

    let przycisk2 = document.createElement('button');
    przycisk2.id = 'usun';
    przycisk2.addEventListener('click', function() {
        usun(nowyDiv.id);
    });
    przyciskiDiv.appendChild(przycisk2);
    let p2 = document.createElement('i');
    p2.classList.add('fa-solid', 'fa-trash');
    przycisk2.appendChild(p2);

    let przycisk3 = document.createElement('button');
    przycisk3.id = 'zaznacz';
    przycisk3.addEventListener('click', zaznacz);
    przyciskiDiv.appendChild(przycisk3);
    let p3 = document.createElement('i');
    p3.classList.add('fa-regular', 'fa-circle-check');
    przycisk3.appendChild(p3);
}

let notatka = [];