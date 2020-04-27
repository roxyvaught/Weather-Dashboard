var APIKey = "d784b93f4281578b9c6f34833cca9d27"
var cityInputEl = document.getElementById("cityInput");
var buttonEl = document.getElementById("button");
var todayTemperatureEl = document.getElementById("temperature");
var todayHumidityEl = document.getElementById("humidity");
var todayWindSpeedEl = document.getElementById("wind-speed");
var todayUVIEl = document.getElementById("uv-index");
var weatherImgEl = document.getElementById("weather-image");
var cityNameEl = document.getElementById("city-name");
//today weather
var apiUrl = "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" +APIKey;
//5 day weather
var apiWeek = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" +APIKey;


getTodaysWeather = function(cityName) {
    fetch(apiUrl, {method: "GET"})
    .then(response => response.json())
        .then(function(response) {
            let weatherImg = response.weather[0].icon;
            cityNameEl.innerHTML = response.name;
            weatherImgEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherImg + "@2x.png");
            todayTempEl.innerHTML = "Temperature: " + k2f(response.main.temp) + "&#176F";
            todayHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
            todayWindSpeedEl.innerHTML = "Wind Speed: " + response.wind.speed + "mph";

            let longitude = response.coord.lon;
            let latitude = response.coord.lat;

            let weatherUVAPI = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude; 

            fetch(weatherUVAPI, {method: "GET"})
            .then(response => response.json())
                .then(function(response) {
                let UVI = document.createElement("span");
                UVI.innerHTML = response[0].value;
                todayUVIEl.innerHTML = "UV Index: ";
                todayUVIEl.append(UVI);
                });
        })
}
