<h1>Moja Dokumentacja</h1>
<h4>Opis wszytkich gier i użytecznych aplikacji</h4>
<br><br>
<h2>TO DO LIST</h2>
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
