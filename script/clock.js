/*1. Här ska klockslag och datum synas och klockan ska ändras när tiden ändras utan att sidan laddas om.
*/

window.addEventListener('load', function () {
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

});