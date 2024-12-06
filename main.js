document.addEventListener("DOMContentLoaded", async () => {
    const planetName = document.querySelector(".planet-name");
    const planetInfoContainer = document.querySelector(".planet-info");

    // Hämtar API-nyckeln från servern
    const apiKey = await getApiKey();

    if (apiKey) {
        // Hämtar planetinformation från API:et med hjälp av den hämtade API-nyckeln
        const planetData = await fetchPlanetsInfo(apiKey);

        if (planetData && planetData.bodies) {  // Kollar om det finns planeter i API-svaret

            let currentPlanetName = window.location.pathname.split("/").pop().split(".")[0];

            // Hämtar planetens namn från URL, exempelvis från 'earth.html'

            // Skapar en mappling för att översätta planetnamnen till svenska
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

            // Letar efter planetens data i API-svaret baserat på det översatta namnet
            const planet = planetData.bodies.find(p => p.name === translatedPlanetName);

            if (planet) {
                // Sätter planetens namn på sidan
                planetName.textContent = planet.name;

                // Visar planetens detaljer i informationstexten
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

    // Söker efter planet när formuläret skickas
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Förhindrar att sidan laddas om
        const planet = document.getElementById('search-input').value.trim().toLowerCase();

        // Definierar en lista med planetsidor
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
    
        // Kontrollerar om den sökta planeten finns i planets-listan
        if (planets[planet]) {
            window.location.href = planets[planet]; // Navigerar till den valda planetsidan
        } else {
            alert("Planeten finns inte. Kontrollera stavningen!"); // Visar ett meddelande om planeten inte finns
        }
    });

    // Hämtar API-nyckel från servern
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

    // Hämtar planetspecifik information från API
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
