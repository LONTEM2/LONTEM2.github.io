<h1>Moja Dokumentacja</h1>
<h4>Opis wszytkich gier i użytecznych aplikacji</h4>
<br><br>
<h2>TO DO LIST</h2>
<h4>index.html</h4>
<table border="1">
    <tr>
        <th>Element</th>
        <th>Opis</th>
    </tr>
    <tr>
        <td><p>&lt;!DOCTYPE html&gt;</p></td>
        <td><p>Deklaracja dokumentu HTML5.</p></td>
    </tr>
    <tr>
        <td><p>&lt;html lang="pl"&gt;</p></td>
        <td><p>Otwiera dokument HTML z określeniem języka polskiego.</p></td>
    </tr>
    <tr>
        <td><p>&lt;head&gt;</p></td>
        <td><p>Sekcja nagłówka dokumentu, zawiera meta informacje, tytuł strony i linki do zasobów zewnętrznych.</p></td>
    </tr>
    <tr>
        <td><p>&lt;meta charset="UTF-8"&gt;</p></td>
        <td><p>Ustawienie kodowania znaków na UTF-8, co zapewnia poprawne wyświetlanie polskich znaków.</p></td>
    </tr>
    <tr>
        <td><p>&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</p></td>
        <td><p>Optymalizacja strony pod urządzenia mobilne, ustawienie szerokości na szerokość urządzenia.</p></td>
    </tr>
    <tr>
        <td><p>&lt;title&gt;TO DO LIST&lt;/title&gt;</p></td>
        <td><p>Ustawienie tytułu strony w przeglądarce na "TO DO LIST".</p></td>
    </tr>
    <tr>
        <td><p>&lt;link rel="stylesheet" href="style.css"&gt;</p></td>
        <td><p>Załadowanie arkusza stylów CSS, który odpowiada za wygląd strony.</p></td>
    </tr>
    <tr>
        <td><p>&lt;link rel="shortcut icon" href="/assets/favicontodo.png" type="image/x-icon"&gt;</p></td>
        <td><p>Ustawienie ikony favicon dla strony.</p></td>
    </tr>
    <tr>
        <td><p>&lt;link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"&gt;</p></td>
        <td><p>Załadowanie zewnętrznej biblioteki Font Awesome dla ikon.</p></td>
    </tr>
    <tr>
        <td><p>&lt;script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"&gt;&lt;/script&gt;</p></td>
        <td><p>Załadowanie zewnętrznej biblioteki SweetAlert2 do wyświetlania okienek alertów.</p></td>
    </tr>
    <tr>
        <td><p>&lt;body&gt;</p></td>
        <td><p>Otwiera sekcję ciała dokumentu HTML, gdzie umieszczona jest treść strony.</p></td>
    </tr>
    <tr>
        <td><p>&lt;div id="main"&gt;</p></td>
        <td><p>Główny kontener dla całej zawartości strony.</p></td>
    </tr>
    <tr>
        <td><p>&lt;div id="tsquare"&gt;</p></td>
        <td><p>Kontener dla głównej części aplikacji "TO DO LIST".</p></td>
    </tr>
    <tr>
        <td><p>&lt;div id="backgroundSquare"&gt;</p></td>
        <td><p>Kontener tła w głównym oknie aplikacji.</p></td>
    </tr>
    <tr>
        <td><p>&lt;h1 id="title1"&gt;TO DO LIST&lt;/h1&gt;</p></td>
        <td><p>Tytuł aplikacji, wyświetlany na stronie.</p></td>
    </tr>
    <tr>
        <td><p>&lt;button id="loadFromJson" onclick="loadFromJson()"&gt;&lt;i class="fa-sharp fa-solid fa-file-import"&gt;&lt;/button&gt;&lt;/i&gt;</p></td>
        <td><p>Przycisk do załadowania danych z pliku JSON. Zawiera ikonę pliku importu.</p></td>
    </tr>
    <tr>
        <td><p>&lt;button id="saveToJson" onclick="saveToJson()"&gt;&lt;i class="fa-solid fa-floppy-disk"&gt;&lt;/i&gt;</p></td>
        <td><p>Przycisk do zapisania danych do pliku JSON. Zawiera ikonę dyskietki.</p></td>
    </tr>
    <tr>
        <td><p>&lt;div id="square"&gt;&lt;/div&gt;</p></td>
        <td><p>Kontener na notatki, gdzie użytkownik może dodawać i edytować elementy listy zadań.</p></td>
    </tr>
    <tr>
        <td><p>&lt;div id="add"&gt;</p></td>
        <td><p>Kontener z przyciskiem do dodania nowej notatki.</p></td>
    </tr>
    <tr>
        <td><p>&lt;button id="adding" onclick="showAddWindow(null,null)"&gt;&lt;i id="plus" class="fa-duotone fa-solid fa-plus"&gt;&lt;/i&gt;&lt;/button&gt;</p></td>
        <td><p>Przycisk do wywołania okna dodawania nowej notatki, z ikoną plusa.</p></td>
    </tr>
    <tr>
        <td><p>&lt;div class="edit" id="addWindow"&gt;</p></td>
        <td><p>Okno edycji notatki, które pojawia się po kliknięciu przycisku "dodaj".</p></td>
    </tr>
    <tr>
        <td><p>&lt;input id="input" type="text" placeholder="Title" required&gt;</p></td>
        <td><p>Pole tekstowe do wpisania tytułu nowej notatki.</p></td>
    </tr>
    <tr>
        <td><p>&lt;textarea id="txtarea" placeholder="Description..." required&gt;&lt;/textarea&gt;</p></td>
        <td><p>Pole tekstowe do wpisania opisu nowej notatki.</p></td>
    </tr>
    <tr>
        <td><p>&lt;button onclick="addNewNote()"&gt;&lt;i id="plus" class="fa-duotone fa-solid fa-plus"&gt;&lt;/i&gt;&lt;/button&gt;</p></td>
        <td><p>Przycisk do zapisania nowej notatki po wpisaniu tytułu i opisu.</p></td>
    </tr>
    <tr>
        <td><p>&lt;div id="change"&gt;</p></td>
        <td><p>Kontener dla okna edycji zmienionej notatki.</p></td>
    </tr>
    <tr>
        <td><p>&lt;div class="edit" id="change"&gt;</p></td>
        <td><p>Okno edycji istniejącej notatki.</p></td>
    </tr>
    <tr>
        <td><p>&lt;input id="input2" type="text" placeholder="Title" required &gt;</p></td>
        <td><p>Pole tekstowe do edytowania tytułu istniejącej notatki.</p></td>
    </tr>
    <tr>
        <td><p>&lt;textarea id="txtarea2" placeholder="Description..." required&gt;&lt;/textarea&gt;</p></td>
        <td><p>Pole tekstowe do edytowania opisu istniejącej notatki.</p></td>
    </tr>
    <tr>
        <td><p>&lt;button onclick="schowaj2()"&gt;&lt;i id="plus" class="fa-solid fa-pen"&gt;&lt;/i&gt;&lt;/button&gt;</p></td>
        <td><p>Przycisk do zapisania zmian w notatce po edycji.</p></td>
    </tr>
    <tr>
        <td><p>&lt;a id="menu" href="\index.html" class="menu-item"&gt;&lt;button&gt;Menu&lt;/button&gt;&lt;/a&gt;</p></td>
        <td><p>Link do strony głównej aplikacji z przyciskiem do przejścia do menu.</p></td>
    </tr>
    <tr>
        <td><p>&lt;script src="script2.js"&gt;&lt;/script&gt;</p></td>
        <td><p>Załadowanie skryptu JavaScript, który obsługuje interakcje na stronie.</p></td>
    </tr>
</table>
<h4>style.css</h4>
<table border="1">
    <tr>
        <th>Styl</th>
        <th>Opis</th>
    </tr>
    <tr>
        <td>:root</td>
        <td>Definiowanie zmiennych CSS, takich jak kolory, które są później wykorzystywane w całym arkuszu stylów.</td>
    </tr>
    <tr>
        <td>#menu</td>
        <td>Pozycjonowanie stałe menu w prawym górnym rogu ekranu z zaokrąglonymi rogami i tłem.</td>
    </tr>
    <tr>
        <td>#menu button</td>
        <td>Stylizacja przycisków w menu, z białym kolorem tekstu i wyśrodkowaniem.</td>
    </tr>
    <tr>
        <td>body</td>
        <td>Ustawienie tła na główny kolor oraz czcionki na 'Comic Sans MS'.</td>
    </tr>
    <tr>
        <td>button</td>
        <td>Usunięcie domyślnych obramowań i tła przycisków.</td>
    </tr>
    <tr>
        <td>#loadFromJson, #saveToJson, #title1</td>
        <td>Ustawienie elementów w linii z lewej strony i dodanie marginesu do przycisków załadowania i zapisu JSON.</td>
    </tr>
    <tr>
        <td>#square</td>
        <td>Stylizacja kontenera, który przechowuje notatki, z przewijaniem, paddingiem i białym kolorem tekstu.</td>
    </tr>
    <tr>
        <td>#tsquare</td>
        <td>Stylizacja głównego kontenera z tłem w kolorze trzecim, zaokrąglonymi rogami i cieniem.</td>
    </tr>
    <tr>
        <td>section</td>
        <td>Stylizacja sekcji (notatki), z tłem, zaokrąglonymi rogami oraz białym tekstem. Zmiana tła przy hoverze.</td>
    </tr>
    <tr>
        <td>section:hover</td>
        <td>Zmiana tła na czwarty kolor przy najechaniu myszką na sekcję.</td>
    </tr>
    <tr>
        <td>#add</td>
        <td>Dodanie paddingu do kontenera z formularzem dodawania notatki.</td>
    </tr>
    <tr>
        <td>#plus</td>
        <td>Ustawienie rozmiaru czcionki na 20px dla ikony plusa.</td>
    </tr>
    <tr>
        <td>#adding</td>
        <td>Stylizacja kontenera do dodawania notatki z tłem, zaokrąglonymi rogami, cieniami oraz białym tekstem.</td>
    </tr>
    <tr>
        <td>#backgroundSquare</td>
        <td>Stylizacja tła sekcji z kolorowym tekstem w czwartym kolorze.</td>
    </tr>
    <tr>
        <td>.edit</td>
        <td>Pozycjonowanie okna edycji na środku ekranu, z tłem i cieniem. Okno ma wysokość 350px i szerokość 500px.</td>
    </tr>
    <tr>
        <td>.edit button</td>
        <td>Stylizacja przycisku w oknie edycji z tłem, zaokrąglonymi rogami i białym tekstem.</td>
    </tr>
    <tr>
        <td>input, #txtarea</td>
        <td>Stylizacja pól tekstowych z przezroczystym tłem, brakiem obramowań i kolorowym tekstem.</td>
    </tr>
    <tr>
        <td>input::placeholder</td>
        <td>Stylizacja tekstu placeholder w polu tekstowym z czcionką i kolorem w czwartym kolorze.</td>
    </tr>
    <tr>
        <td>input:focus</td>
        <td>Usunięcie obramowania i outline przy focussowaniu na polu tekstowym.</td>
    </tr>
    <tr>
        <td>hr</td>
        <td>Stylizacja poziomej linii z tłem w czwartym kolorze i wysokości 1px.</td>
    </tr>
    <tr>
        <td>#txtarea</td>
        <td>Stylizacja obszaru tekstowego z przezroczystym tłem, czwartym kolorem obramowania oraz odpowiednią czcionką.</td>
    </tr>
    <tr>
        <td>#txtarea2</td>
        <td>Podobna stylizacja jak dla #txtarea z tłem przezroczystym i obramowaniem w czwartym kolorze.</td>
    </tr>
    <tr>
        <td>.section</td>
        <td>Stylizacja sekcji notatki z marginesem 20px oraz wysokością 100px.</td>
    </tr>
    <tr>
        <td>.buttons</td>
        <td>Pozycjonowanie przycisków w sekcji z lewym marginesem.</td>
    </tr>
    <tr>
        <td>.editButton, .deleteButton, .checkButton</td>
        <td>Stylizacja przycisków w sekcji z paddingiem 15px.</td>
    </tr>
    <tr>
        <td>.Description1</td>
        <td>Stylizacja opisu notatki z ograniczeniem szerokości, tekstem, który nie wychodzi poza obramowanie.</td>
    </tr>
    <tr>
        <td>.Title1</td>
        <td>Stylizacja tytułu notatki z marginesem po lewej stronie.</td>
    </tr>
    <tr>
        <td>.cheked</td>
        <td>Stylizacja dla zaznaczonej notatki z przekreślonym tekstem i ciemniejszym tłem.</td>
    </tr>
    <tr>
        <td>.cheked:hover</td>
        <td>Zmiana koloru tła na ciemniejsze przy najechaniu myszką na zaznaczoną notatkę.</td>
    </tr>
    <tr>
        <td>textarea::-webkit-scrollbar, #square::-webkit-scrollbar</td>
        <td>Stylizacja paska przewijania w obszarze tekstowym oraz kontenerze z notatkami z szerokością 10px.</td>
    </tr>
    <tr>
        <td>textarea::-webkit-scrollbar-track, #square::-webkit-scrollbar-track</td>
        <td>Stylizacja tła paska przewijania z zaokrąglonymi rogami i kolorem tła.</td>
    </tr>
    <tr>
        <td>textarea::-webkit-scrollbar-thumb, #square::-webkit-scrollbar-thumb</td>
        <td>Stylizacja samego paska przewijania z tłem w głównym kolorze oraz zaokrąglonymi rogami.</td>
    </tr>
</table>
<h4>script.js</h4>
<table border="1">
  <thead>
    <tr>
      <th>Nazwa funkcji</th>
      <th>Opis</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>window.addEventListener('load', ...)</td>
      <td>Funkcja wywołana po załadowaniu strony, pobiera zapisane notatki z localStorage i wyświetla je.</td>
    </tr>
    <tr>
      <td>saveToJson()</td>
      <td>Zapisuje notatki w formacie JSON do localStorage oraz umożliwia pobranie pliku JSON z notatkami.</td>
    </tr>
    <tr>
      <td>loadFromJson()</td>
      <td>Ładuje notatki z pliku JSON wybranego przez użytkownika, konwertuje je na obiekty i zapisuje w aplikacji.</td>
    </tr>
    <tr>
      <td>deleteNotes()</td>
      <td>Usuwa wszystkie notatki z widoku HTML i resetuje zawartość sekcji.</td>
    </tr>
    <tr>
      <td>deleteNote(id)</td>
      <td>Usuwa jedną notatkę na podstawie jej ID, aktualizując listę notatek i zapisując dane do localStorage.</td>
    </tr>
    <tr>
      <td>showAddWindow(title, description)</td>
      <td>Pokazuje okno do dodawania/edycji notatki z wstępnie wypełnionymi polami tytułu i opisu.</td>
    </tr>
    <tr>
      <td>hideAddWindow()</td>
      <td>Ukrywa okno do dodawania/edycji notatki i resetuje wartości pól wejściowych.</td>
    </tr>
    <tr>
      <td>addNewNote()</td>
      <td>Dodaje nową notatkę lub edytuje istniejącą, zapisując zmiany w localStorage.</td>
    </tr>
    <tr>
      <td>saveDataToLocalStorage()</td>
      <td>Zapisuje aktualny stan notatek w localStorage.</td>
    </tr>
    <tr>
      <td>showNoteToEdit(id)</td>
      <td>Wywołuje okno edycji dla wybranej notatki na podstawie jej ID.</td>
    </tr>
    <tr>
      <td>editNode(id, title, description)</td>
      <td>Edytuje tytuł i opis istniejącej notatki oraz aktualizuje widok w HTML.</td>
    </tr>
    <tr>
      <td>checkNode(id)</td>
      <td>Zaznacza lub odznacza notatkę jako wykonaną, zmieniając jej styl i zapisując stan w localStorage.</td>
    </tr>
    <tr>
      <td>createElementNote(note, index)</td>
      <td>Tworzy nowy element HTML reprezentujący notatkę oraz dodaje go do widoku na stronie.</td>
    </tr>
    <tr>
      <td>refreshIndexes()</td>
      <td>Aktualizuje indeksy notatek w widoku po ich usunięciu, aby zachować poprawną numerację.</td>
    </tr>
    <tr>
      <td>playAlert()</td>
      <td>Wyświetla alert w przypadku niepoprawnych danych, takich jak brak tytułu notatki.</td>
    </tr>
  </tbody>
</table>
