Welcome to my Dashboard created for for the course Advance Frontend Development at Chas Academy!

This website is coded in 100% vanilla JS, HTML and CSS by Eva 'evesteve' Bjöling.

Github accoount: evesteve94 (https://github.com/evesteve94)

Netflify link: https://dashboard-evesteve-open-access.netlify.app/

**Positives:**

- The layout is nearly identical to the mockup design of the assignment: https://qlok.notion.site/Individuellt-projekt-The-Dashboard-808b39d4fca84cf08f7efedad153c9e7
- So far, there are no errors in the console
- The data from API's have worked smoothly through trial and error, with no difficultites in fetching the data.
- All keys and values are properly stored i localStorage with semantic titles, and are deleteable by the user
- The JS code is well commented (in Swedish)
- Some (not all) requirements for Unplash API are met (see attributions to photographer at bottom of the page)
- Many small things have been added to improve the user experience - such as: blur()for inputs when pressing enter/tab, the input field clearing after entry, the crusor changing to a pointer to show the user what is 'clickable'
- The layout is fairly responsive and looks good on various screens.
- good/bad - my api keys (sensitive information) is NOT in an ignored folder. You will not have to use your own access keys to Unsplash and OpenweatherAPI to access all data properly.

**To be fixed/ room for improvement**

- All cards have a fixed width in pixels - to ensure that the content is consistent. However, this makes the cards less responsive. It could look better on tablet screens.
- The weather forecast only takes the current, in 24h and in 48h into account. It would be better to get an averge temperture/weather description.
- If the user updates the weather at night -> the temperature showing for coming days will look colder than the temperature during the daytime.
- The modal that appears to add a new link would look better is placed inside the link-card. It does not have to take up the entire screen.
- Quote of the day is a very easy API that does not require a key. It would be more impressive to have a more complex content for my card-of-chosing.
- Quick links only work if the user has types/copied the full URL with https://....
- The attributing banner at the bottom of the screen can sometimes cover the random image button (depending on the size of the screen)
- The Unplash API accesskey is limitted to (I think) 50 requests per hour. Not all requirements are met according to the documentation to apply for 'production level' use (5.000 requests/hour)
- The getWeather() and getWeatherByCity() funtions could posibly be combined to limit amount of code.
- There are a LIMITED NUMBER OF COMMITS becasue I only initialized a new repo after most of the Dashboard was done. It would be better to have tracked my progress and saved multiple versions in case something went wrtong and I wanted to go back to older versions.
# dashboard-secret-api-keys
