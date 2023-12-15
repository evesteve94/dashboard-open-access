/*2. Rubriken på sidan ska användaren kunna ändra genom att klicka på den. När användaren klickat på rubriken 
blir den redigerbar och ändringarna sparas direkt.  */

const userTitle = document.getElementById('title');

// hämtar titeln (om redan sparad) från localStorage
window.addEventListener('load', function () {
    //sparar sparade titeln i en variable
    const storedTitle = localStorage.getItem('userTitle');
    
    //undersöker om värdet finns (boolean)
    if (storedTitle) {
      //uppdaterar titeln
      userTitle.value = storedTitle;
    }
  });

// inputen sparas när användaren trycker på enter
userTitle.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      // anropar function för att spara tll localStorage
      saveTitleToLocalStorage();
      //tar bort 'highlight' från input
      userTitle.blur();
    }
  });
  
  function saveTitleToLocalStorage() {
    const enteredTitle = userTitle.value;
  
    // undersöker att titeln inte är tom/fylld av whitespace
    if (enteredTitle.trim() !== '') {
      // sparar värdet av enteredTitle till nyckeln userTitle i localStorage
      localStorage.setItem('userTitle', enteredTitle);
    }
  };