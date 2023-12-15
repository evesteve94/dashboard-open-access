/* 3)  Denna del innehåller länkar som användaren sparat. Användaren kan ta bort länkar (3a) 
samt lägga till nya (3b). När användaren lägger till nya länkar ska användaren fylla i länken 
samt en rubrik som denna vill ska synas i dashboarden. */

  //inväntar att DOMen laddas färdigt innan koden körs
  document.addEventListener('DOMContentLoaded', () => {
    //hämtar alla element från HTML
    const addLinkButton = document.getElementById('add-link');
    const addLinkModal = document.getElementById('myModal');
    const closeModalButton = document.getElementById('closeModalBtn');
    const saveLinkButton = document.getElementById('save-link');
    const addedLinks = document.getElementById('added-links');

    // Visar modalen när knappen trycks
    addLinkButton.addEventListener('click', function () {
        addLinkModal.classList.add('reveal-modal');
    });

    // stänger modalen
    closeModalButton.addEventListener('click', function () {
        addLinkModal.classList.remove('reveal-modal');
        addLinkModal.classList.add('hidden-modal');
    });

    // sparar värdena i localStorage när knappen trycks
    saveLinkButton.addEventListener('click', function () {
        //sparar dess värden
        const linkInput = document.getElementById('link');
        const titleInput = document.getElementById('link-title');

        const linkValue = linkInput.value;
        const titleValue = titleInput.value;

        // undersöker att båda fält har innehåll
        if (linkValue && titleValue) {
            // skapar ny länk-div
            const newLink = document.createElement('a');
            newLink.classList.add('user-link-div');
            newLink.href = linkValue;
            newLink.target = '_blank';
            newLink.innerHTML = `
                <img src="./images/google-logo.png" class="link-logo"> 
                <a class="user-link" href="${linkValue}" target="_blank">${titleValue}</a>
                <img src="./images/remove.png" class="remove-link"> 
            `;

            // lägger till nya länken i kortet
            addedLinks.appendChild(newLink);

            //sparar länkar till localStorage -anropar funktion
            saveLinkToLocalStorage(linkValue, titleValue);

            // stänger modalen när allt har sparats
            addLinkModal.classList.remove('reveal-modal');
            addLinkModal.classList.add('hidden-modal');

            // tömmer båda fält
            linkInput.value = '';
            titleInput.value = '';

            // lägger till händelser för remove-linkbtn
            const removeLinkButton = newLink.querySelector('.remove-link');
            removeLinkButton.addEventListener('click', function (event) {
                // tar bort länken från kortet
                addedLinks.removeChild(newLink);
                //ser till att länken raderas utan att öppnas först
                event.preventDefault();
                // tar bort från localStorage - anrop
                removeLinkFromLocalStorage(linkValue, titleValue);
            });
        }
    });

    // Function för att spara till localStorage
    function saveLinkToLocalStorage(link, title) {
        // hämtar redan tillagda länkar || skapar ny array om inga finns
        const storedLinks = JSON.parse(localStorage.getItem('userLinks')) || [];

        // pushar ny länk till array
        storedLinks.push({ link, title });

        // sparar uppdaterad array till localStorage --> omvandlar till string
        localStorage.setItem('userLinks', JSON.stringify(storedLinks));
    }

    // Function som tar bort länkar från localStorage
    function removeLinkFromLocalStorage(link, title) {
        //formaterar tillbaka från string till js object || skapar tom array
        const storedLinks = JSON.parse(localStorage.getItem('userLinks')) || [];

        // filterar en ny array och undersöker att rätt titel/länk matchar --> tas bort
        const updatedLinks = storedLinks.filter(linkData => linkData.link !== link && linkData.title !== title);

        // sparar den uppdaterade arrayn till localStorage --> omvandlar till string
        localStorage.setItem('userLinks', JSON.stringify(updatedLinks));
    }

    // Function som hämtar länkar från localStorage + skapar usser-link-divar || skapar ny array om den är tom
    function loadLinksFromLocalStorage() {
        const storedLinks = JSON.parse(localStorage.getItem('userLinks')) || [];

        //skapar div för varje länk
        storedLinks.forEach(linkData => {
            const newLink = document.createElement('a');
            newLink.classList.add('user-link-div');
            newLink.href = linkData.link;
            newLink.target = '_blank';
            newLink.innerHTML = `
                <img src="./images/google-logo.png" class="link-logo"> 
                <a class="user-link" href="${linkData.link}" target="_blank">${linkData.title}</a>
                <img src="./images/remove.png" class="remove-link"> 
            `;

            // lägger till i kortet
            addedLinks.appendChild(newLink);

            // händelse till remove-link
            const removeLinkButton = newLink.querySelector('.remove-link');
            removeLinkButton.addEventListener('click', function (event) {
                // tar bort när knappen trycks
                addedLinks.removeChild(newLink);
                //ser till att länken raderas utan att öppnas först
                event.preventDefault();

                // tar bort från localStorage
                removeLinkFromLocalStorage(linkData.link, linkData.title);
            });
        });
    }

    // anropar function för att ladda länkar från localStorage
    loadLinksFromLocalStorage();
});