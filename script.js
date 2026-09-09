// Get your API key from https://openweathermap.org/api
const API_KEY = "PASTE_YOUR_API_KEY_HERE";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const welcomeMessage = document.getElementById("welcomeMessage");

searchBtn.addEventListener("click", searchWeather);
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchWeather();
});

function searchWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        showError("Please enter a city name!");
        return;
    }
    getWeather(city);
}

async function getWeather(city) {
    try {
        errorMessage.classList.add("hidden");
        weatherCard.classList.add("hidden");
        welcomeMessage.classList.add("hidden");
        loading.classList.remove("hidden");

        if (API_KEY === "6e10282ab4e6d15f433427281e001b2b") {
            throw new Error("Please add your OpenWeather API key in script.js");
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) throw new Error("City not found. Please enter a valid city.");
            if (response.status === 401) throw new Error("Invalid API key. Please check your API key.");
            throw new Error("Unable to fetch weather data. Please try again.");
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    } finally {
        loading.classList.add("hidden");
    }
}

function displayWeather(data) {
    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;

    const visibility = data.visibility ? (data.visibility / 1000).toFixed(1) : "N/A";
    document.getElementById("visibility").textContent = visibility === "N/A" ? "N/A" : `${visibility} km`;

    document.getElementById("clouds").textContent = `${data.clouds.all}%`;
    document.getElementById("minTemp").textContent = `${Math.round(data.main.temp_min)}°C`;
    document.getElementById("maxTemp").textContent = `${Math.round(data.main.temp_max)}°C`;

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    document.getElementById("date").textContent = new Date().toDateString();
    weatherCard.classList.remove("hidden");
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}
