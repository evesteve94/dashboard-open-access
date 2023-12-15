/* 4. Här ska vädret i närtid visas. Denna behöver inte se ut exakt som i skissen men 
det ska vara data som hämtas från något öppet API. För att avgöra vilken stad vädret ska 
visas för ska browserns geolocation-api användas.
*/

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

    async function getWeatherKey(){
        const response = await fetch('./data/secret.json');
        if(response.ok){
            const keys = await response.json();
            const weatherKey = keys[0].weatherKey;
            return weatherKey;
        } else {
            console.log(`HTTP error message: ${response.status}`);
        }
    };

    //hämtar lat + long från getLocation (geolocation) där functionen anropas
    async function getWeather(latitude, longitude) {
        //lagrar nyckel + api url + 
        
        //hämtar hemligt api key
        const apiKey = await getWeatherKey();
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

    async function getWeatherByCity(city) {
        //samma som getWether - med city som argument

        //hämtar hemlig API nyckel
        const apiKey = await getWeatherKey();
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
