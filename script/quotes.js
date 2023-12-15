/* 5. Denna del får du fritt bestämma vad den ska innehålla. 
Det ska dock vara data från ett externt API och exempelvis kan det vara senaste nyheterna eller aktiekurser.
*/

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
