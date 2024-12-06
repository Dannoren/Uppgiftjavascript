document.addEventListener("DOMContentLoaded", async () => {
    const planetName = document.querySelector(".planet-name");
    const planetInfoContainer = document.querySelector(".planet-info");

    // Hämta API-nyckel
    const apiKey = await getApiKey();
    console.log('API Key:', apiKey);  // Kontrollera om nyckeln hämtas korrekt

    if (apiKey) {
        // Hämta planetspecifik information
        const planetData = await fetchPlanetsInfo(apiKey);
        console.log('API Response:', planetData); // Logga hela svaret för att undersöka strukturen

        if (planetData && planetData.bodies) {  // Kolla om "bodies" finns i svaret
            console.log('Found bodies:', planetData.bodies);  // Logga bodies för att se datan för alla planeter

            let currentPlanetName = window.location.pathname.split("/").pop().split(".")[0];

            // Om vi är på index.html (eller startsidan), sätt planeten till 'earth' eller någon annan default planet.
           
            console.log('Planet from URL:', currentPlanetName);  // Logga den hämtade planetens namn från URL

            // Här byter vi namn för att matcha med de svenska namnen från API
            const planetNameMapping = {
                'earth': 'Jorden',
                'mercury': 'Merkurius',
                'venus': 'Venus',
                'mars': 'Mars',
                'jupiter': 'Jupiter',
                'saturn': 'Saturnus',
                'uranus': 'Uranus',
                'neptune': 'Neptunus',
                'sun': 'Solen'
            };

            const translatedPlanetName = planetNameMapping[currentPlanetName.toLowerCase()];
            console.log('Translated Planet Name:', translatedPlanetName);  // Kontrollera översättningen

            console.log('API planet names:', planetData.bodies.map(p => p.name));

            // Hitta planetens data i API-svaret med det översatta namnet
            const planet = planetData.bodies.find(p => p.name === translatedPlanetName);
            console.log('Found Planet:', planet);  // Logga planeten för att se om den hittas i datan

            if (planet) {
                // Visa planetens namn på sidan
                planetName.textContent = planet.name;

                // Lägg till planetens information i planet-info-rutan
                planetInfoContainer.innerHTML = `
                    <p><strong>Latin Name:</strong> ${planet.latinName}</p>
                    <p><strong>Rotation:</strong> ${planet.rotation} hours</p>
                    <p><strong>Circumference:</strong> ${planet.circumference} km</p>
                    <p><strong>Day Temperature:</strong> ${planet.temp.day}°C</p>
                    <p><strong>Night Temperature:</strong> ${planet.temp.night}°C</p>
                    <p><strong>Distance from Sun:</strong> ${planet.distance} million km</p>
                    <p><strong>Orbital Period:</strong> ${planet.orbitalPeriod} days</p>
                    <p><strong>Description:</strong> ${planet.desc}</p>
                    <p><strong>Moons:</strong> ${planet.moons.join(", ")}</p>
                `;
            } else {
                planetInfoContainer.innerHTML = "<p>Planet information not available. Please check if the planet name in the URL matches the data.</p>";
            }
        } else {
            planetInfoContainer.innerHTML = "<p>Error: Unexpected planet data format. Please check the API response.</p>";
        }
    }

    // Lägg till sökfunktionalitet här
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Hindrar sidan från att ladda om
        const planet = document.getElementById('search-input').value.trim().toLowerCase();
        console.log("Searched planet:", planet);  // Logga den sökta planeten
    
        // Skapa en lista över planetsidor
        const planets = {
            mercury: "mercury.html",
            venus: "venus.html",
            earth: "earth.html",
            mars: "mars.html",
            jupiter: "jupiter.html",
            saturn: "saturn.html",
            uranus: "uranus.html",
            neptune: "neptune.html",
            jorden: "earth.html", // Lägg till svenska planetnamn här
            merkurius: "mercury.html",
            venus: "venus.html",
            mars: "mars.html",
            saturnus: "saturn.html",
            uranus: "uranus.html",
            neptunus: "neptune.html",
            solen: "sun.html" // Lägg till alla planetsidor
        };
    
        // Kontrollera om planeten finns
        if (planets[planet]) {
            console.log("Redirecting to:", planets[planet]);  // Logga URL:n som användaren omdirigeras till
            window.location.href = planets[planet]; // Navigera till sidan
        } else {
            console.log("Planet not found, showing alert.");
            alert("Planeten finns inte. Kontrollera stavningen!"); // Alert om planeten inte finns
        }
    });

// Hämta API-nyckel
async function getApiKey() {
    try {
        const response = await fetch(
            'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys', 
            { method: 'POST' }
        );

        if (!response.ok) {
            throw new Error(`Error fetching API key: ${response.statusText}`);
        }

        const data = await response.json();
        return data.key;
    } catch (error) {
        console.error('Error fetching API key:', error.message);
    }
}

// Hämta planetspecifik information
async function fetchPlanetsInfo(apiKey) {
    try {
        const response = await fetch(
            'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies',
            {
                method: 'GET',
                headers: { "x-zocom": apiKey }
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching planet data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching planet data:', error.message);
    }
}
});