/* 7. När användaren klickar på denna knapp ska en randomiserad bild från Unsplash API 
hämtas och läggas in som bakgrund på dashboarden.*/

document.addEventListener('DOMContentLoaded', () => {
    //hämtar knappen 
    const randomImage = document.getElementById('random-image');
    const userImageInput = document.getElementById('user-image-input');

    //anropar funktion när knappen trycks
    randomImage.addEventListener('click', function(){
        fetchRandomImage();
    });

    async function getUnsplashKey(){
        const response = await fetch('./data/secret.json');
        if(response.ok){
            const keys = await response.json();
            const unsplashKey = keys[1].unsplashKey;
            return unsplashKey;
        } else {
            console.log(`HTTP error message: ${response.status}`);
        }
    };


    //hämtar en slumpas bild baserat på ett keyword - eller när sidan laddas
    async function fetchRandomImage(keyword) {
        //API nyckel + URL med sparat keyword som query

        //hämtar hemlig nyckel tll unsplash
        const accessKey = await getUnsplashKey();
        const apiUrl = `https://api.unsplash.com/photos/random?query=${keyword}&client_id=${accessKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                //hämtar url + fotograf information
                const imageUrl = data.urls.regular;
                const photographerName = data.user.name;
                const photographerProfile = data.user.links.html;

                //styling till body --> uppdaterar bakgrundsbild
                document.body.style.backgroundImage = `url('${imageUrl}')`;

                // uppdaterar 'cred' footern - enligt vissa instruktioner från Unsplash
                const imageUrlDiv = document.getElementById('imageUrl');
                imageUrlDiv.innerHTML = `
                <a href="${imageUrl}" target="_blank">Link to image</a>
                `;

                //skapar attribution/cred
                const attributionDiv = document.createElement('div');
                attributionDiv.classList.add('attribution');
                attributionDiv.innerHTML = `
                Photo by <a href="${photographerProfile}" target="_blank">${photographerName}</a> on Unsplash
                `;

                imageUrlDiv.appendChild(attributionDiv);
            })
            .catch(error => {
                console.error('Error fetching random image:', error);
            });
    }

    userImageInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            const keyword = this.value;
            fetchRandomImage(keyword);
            this.value = ''; // Clear the input after pressing Enter
            userImageInput.blur();
        }
    });

    //hämtar slumpad bild när sidan laddas
    fetchRandomImage();

});