/*Beskrivning av funktionaliteten

1. Här ska klockslag och datum synas och klockan ska ändras när tiden ändras utan att sidan laddas om.
2. Rubriken på sidan ska användaren kunna ändra genom att klicka på den. När användaren klickat på rubriken blir den redigerbar och ändringarna sparas direkt.
3. Denna del innehåller länkar som användaren sparat. Användaren kan ta bort länkar (3a) samt lägga till nya (3b). När användaren lägger till nya länkar ska användaren fylla i länken samt en rubrik som denna vill ska synas i dashboarden.
    
    Extra utmaning: Hämta länkens favicon och visa som bild i dashboarden.
    
4. Här ska vädret i närtid visas. Denna behöver inte se ut exakt som i skissen men det ska vara data som hämtas från något öppet API. För att avgöra vilken stad vädret ska visas för ska browserns geolocation-api användas.
    
    Extra utmaning: Gör så att användaren kan anpassa orten som visas
    
5. Denna del får du fritt bestämma vad den ska innehålla. Det ska dock vara data från ett externt API och exempelvis kan det vara senaste nyheterna eller aktiekurser.
6. I den här delen ska användaren kunna skriva snabba anteckningar. Tänk en stor textarea bara där det som skrivs sparas hela tiden. Det ska inte finnas flera olika anteckningar utan bara just en yta.
7. När användaren klickar på denna knapp ska en randomiserad bild från Unsplash API hämtas och läggas in som bakgrund på dashboarden.
    
    Extra utmaning: Låt användaren fylla i ett sökord som används för att hitta en randomiserad bild så att det blir inom ett tema som användaren önskar. */

//1) klockslag och datum
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const date = now.toDateString();
  
    const clockElement = document.getElementById('clock');
    clockElement.innerHTML = `<strong>${hours}:${minutes}:${seconds}</strong> <span>${date} </span>`;
  }
  
  // uppdatera klockan varje sekund
  setInterval(updateClock, 1000);
  
  // uppdatera klockan direkt när sidan laddas
  updateClock();

//2) Ändra rubrik
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
  }

  /* 3)  Denna del innehåller länkar som användaren sparat. Användaren kan ta bort länkar (3a) samt lägga till nya (3b). När användaren lägger till nya länkar ska användaren fylla i länken samt en rubrik som denna vill ska synas i dashboarden. */

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

// 4. Här ska vädret i närtid visas. Denna behöver inte se ut exakt som i skissen men det ska vara data som hämtas från något öppet API. För att avgöra vilken stad vädret ska visas för ska browserns geolocation-api användas.

//inväntar att DOMen laddas färdigt innan koden körs
document.addEventListener('DOMContentLoaded', () => {
    //hämtar HTML element
    const weatherCard = document.getElementById('weather-card');
    const locationInput = document.getElementById('locationInput');
    const locationButton = document.getElementById('location-btn');
    const weatherTitle = document.getElementById('weather-title');
    // hämtar dagens datum från Date objektet
    const today = new Date();

    // hämtar dagen därpås datum genom att lägga till 2 dagar
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    // array för alla veckodagar
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    //sparar datumet i variabler 
    const dayAfterTomorrowName = daysOfWeek[dayAfterTomorrow.getDay()];

    //hämtar lat + long från getLocation (geolocation) där functionen anropas
    function getWeather(latitude, longitude) {
        //lagrar nyckel + api url + 
        const apiKey = 'c20077b887631a54b4b5e39131893591';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        //hämtar från API
        fetch(apiUrl)
            //väntar på response - parse från API till JS object
            .then(response => response.json())
            //går igenom datan från API
            .then(data => {
                const forecasts = data.list;
                // function formaterar prognosen från 'forecast' -> hämtar icon, temp (Math.ceiling för att avrunda temp) + description
                const formatWeather = (forecast) => `                        
                <img class="weather-icon" src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather Icon">
                <p>${Math.ceil(forecast.main.temp)}°C ${forecast.weather[0].description}</p>
                `;

                const today = forecasts[0];
                const tomorrow = forecasts[8]; // 24 timmar senare - imorgon
                const dayAfterTomorrow = forecasts[16]; // 48 timmar senare - dagen därpå

                // ny string där värdet från daysOfWeek hämtas + funktionen formatWeather körs med dagarna som parameterar
                // ger resultatet --> tre dagars prognos
                const weatherHTML = `
                    <div class="weather-days">
                        <h4> Today </h4>${formatWeather(today)}
                    </div>
                    
                    <div class="weather-days">
                        <h4> Tomorrow </h4>${formatWeather(tomorrow)}
                    </div>
                    
                    <div class="weather-days">
                        <h4> ${dayAfterTomorrowName} </h4>${formatWeather(dayAfterTomorrow)}
                    </div>
                `;

                //uppdaterar innehållet av weatherCard
                weatherCard.innerHTML = weatherHTML;
            })
            //om fetchen får error --> felmeddelande
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherCard.innerHTML = '<h2>Failed to fetch weather data</h2>';
            });
    }

    //uppdaterar prognosen enligt användarens sökord i locationInput
    function updateWeather() {
        //sparas i city ---> tar bort whitespace
        const city = locationInput.value.trim();
        //om city == true (ett värde finns) --> körs en function med city som parameter
        if (city) {
            getWeatherByCity(city);
        //annars skapas en alert
        } else {
            alert('Please enter a valid city');
        }
    }

    function getWeatherByCity(city) {
        //samma som getWether - med city som argument
        const apiKey = 'c20077b887631a54b4b5e39131893591';
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        //updaterar titeln på kortet
        weatherTitle.textContent = `Weather in ${city.toUpperCase()}`

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const forecasts = data.list;
                //skapar innehåll enligt staden
                const formatWeather = (forecast) => `
                        <img class="weather-icon" src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather Icon">
                        <p>${Math.ceil(forecast.main.temp)}°C ${forecast.weather[0].description}</p>
                `;

                const today = forecasts[0];
                const tomorrow = forecasts[8]; // 24 hours later
                const dayAfterTomorrow = forecasts[16]; // 48 hours later

                //skapar innehåll för tre dagars prognos
                const weatherHTML = `
                    <div class="weather-days">
                        <h3> Today </h3>${formatWeather(today)}
                    </div>
                    <div class="weather-days">
                        <h3> Tomorrow </h3>${formatWeather(tomorrow)}
                    </div>
                    <div class="weather-days">
                        <h3> ${dayAfterTomorrowName} </h3>${formatWeather(dayAfterTomorrow)}
                    </div>
                `;
                //lägger till innehåll i weatherCard
                weatherCard.innerHTML = weatherHTML;
            })
            //felmeddelande vid error i fetching
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherCard.innerHTML = '<h2>Failed to fetch weather data</h2>';
            });
    }
    //hämtar användaren geoLocation --> ger felmeddelande vid två tillfällen
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    //sparar long + lat för att skickas till getWeather()
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    getWeather(latitude, longitude);
                },
                error => {
                    console.error('Error getting location:', error);
                    weatherCard.innerHTML = '<h2>Failed to get location</h2>';
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            weatherCard.innerHTML = '<h2>Geolocation not supported</h2>';
        }
    }
    // händelse för locationInput när användaren trycker 'enter' eller reagerar på key 13 (enter)
    function handleEnterKey(event) {
        if (event.keyCode === 13 || event.key === "Enter") {
            updateWeather();
            locationInput.value = '';
            locationInput.blur();
        }
    }
    

    locationInput.addEventListener('keydown', handleEnterKey);

    //anpassat för mobilanvändning --> knapp som uppdaterar efter användarens input
    locationButton.addEventListener('click', function(){
        updateWeather();
        locationInput.value = '';
        locationInput.blur();
    })

    //current location uppdaterar weatherCard när sidan laddas --> skapar innehåll från start
    getLocation();
});

// 5. Denna del får du fritt bestämma vad den ska innehålla. Det ska dock vara data från ett externt API och exempelvis kan det vara senaste nyheterna eller aktiekurser.

// Quote of the day (gratis API utan access key) --> körs efter DOMen laddats färdigt
document.addEventListener('DOMContentLoaded', () => {
    //hämtar citat diven
    const quoteDiv = document.getElementById('quote-div');

    //hämtar API url - väntar på response
    fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(data => {
            // skapar innehåll av datans citat och author
            quoteDiv.innerHTML = `
            <p class="quote"> "${data.content}" </p>
            <p class="author"> - ${data.author} </p>
            `;
        })
        //skapar felmeddelande vid misslyckad fetch
        .catch(error => {
            console.error('Error fetching quote:', error);
            quoteDiv.textContent = 'Failed to fetch quote';
        });
});

// 6. I den här delen ska användaren kunna skriva snabba anteckningar. Tänk en stor textarea bara där det som skrivs sparas hela tiden. Det ska inte finnas flera olika anteckningar utan bara just en yta.

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
}


// 7. När användaren klickar på denna knapp ska en randomiserad bild från Unsplash API hämtas och läggas in som bakgrund på dashboarden.
//hämtar knappen
const randomImage = document.getElementById('random-image');
const userImageInput = document.getElementById('user-image-input');

//anropar funktion när knappen trycks
randomImage.addEventListener('click', function(){
    fetchRandomImage();
});

//hämtar en slumpas bild baserat på ett keyword - eller när sidan laddas
function fetchRandomImage(keyword) {
    //API nyckel + URL med sparat keyword som query
    const accessKey = 'eoMgFXTBy9LPZhjnApA_Ec4ulny7fTHdwjUt4cu7XqE';
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

