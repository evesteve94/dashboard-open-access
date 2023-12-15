/* 6. I den här delen ska användaren kunna skriva snabba anteckningar. 
Tänk en stor textarea bara där det som skrivs sparas hela tiden. 
Det ska inte finnas flera olika anteckningar utan bara just en yta.
*/

// hämtar notepad elementet
const notepad = document.getElementById('notepad');

// hämtar innehåll från localStorage när sidan laddas
window.addEventListener('load', loadNotepadFromLocalStorage);

    // funktioner för att spara antckningar till localstorage körs när användaren trycker 'Tab'
    //använder inte 'enter' för att användaren ska kunna göra en ny i textarea
    notepad.addEventListener('keydown', function (event) {
        if (event.key === 'Tab') {
            saveNotepadToLocalStorage();
            notepad.blur();
        }
    });

    // Function som sparar innehållet till localStorage
    function saveNotepadToLocalStorage() {
        const notepadContent = notepad.value;
        localStorage.setItem('notepadContent', notepadContent);
    }

    // Function som hämtar från localStorage --> uppdaterar notepad
    function loadNotepadFromLocalStorage() {
        const storedNotepadContent = localStorage.getItem('notepadContent');
        //undersöker om ett värde finns
        if (storedNotepadContent) {
            notepad.value = storedNotepadContent;
        }
};