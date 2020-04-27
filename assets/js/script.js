var APIKey = "d784b93f4281578b9c6f34833cca9d27";
var todayDate = moment().format('MM/DD/YYYY');
var uvIndex= "";
var long = "";
var lat = "";
var weatherIcon = "";

const historyEl = document.getElementById("city-search");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

var cityInputEl = document.getElementById("cityInput");
var buttonEl = document.getElementById("button");
var todayTemperatureEl = document.getElementById("temperature");
var todayHumidityEl = document.getElementById("humidity");
var todayWindSpeedEl = document.getElementById("wind-speed");
var todayUVIEl = document.getElementById("uv-index");
var weatherImgEl = document.getElementById("weather-image");
var cityNameEl = document.getElementById("city-name");
var dashboardEl = document.querySelector('#dashboard');

function getUvi() {
    var uviUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + '&lon=' + long + "&appid=" + APIKey;
    fetch(uviUrl).then((response) => {
        if (response.ok) {
            response.json().then(function(data){
                uvIndex = data.value;
                console.log(uvIndex);
                displayWeather(data);
            })
        }
    });
    };


getTodaysWeather = function(cityName) {
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" +APIKey + "&units=imperial";
    fetch(apiURL)
    .then(response => response.json())

        .then(function(response) {
            let weatherImgEl = document.createElement("img");
            weatherImgEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png');
            cityNameEl.innerHTML = response.name;

            todayTemperatureEl.innerHTML = "Temperature: " + response.main.temp + "\xB0F";
            todayHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
            todayWindSpeedEl.innerHTML = "Wind Speed: " + response.wind.speed + "mph";

        })
};

getForecast = function(cityName) {
let apiWeek = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" +APIKey;
    fetch(apiWeek)
        .then(response => response.json())
            .then(function(response) {
    // next 5 days
                    let forecastEl = document.querySelectorAll(".forecast");
                    for (i=0; i<forecastEl.length; i++) {
                        forecastEl[i].innerHTML = "";
                        let forecastIndex = i*8 + 4;
                        let forecastDate = new Date(response.list[forecastIndex].dt * 1000);
                        let forecastDay = forecastDate.getDate();
                        let forecastMonth = forecastDate.getMonth() + 1;
                        let forecastYear = forecastDate.getFullYear();
                        let forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
                        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        forecastEl[i].append(forecastDateEl);
                        let weatherImgEl = document.createElement("img");
                        weatherImgEl.setAttribute('src', 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png');
                        forecastEl[i].append(imgEl);
                        let forecastTempEl = document.createElement("p");
                        forecastTempEl.innerHTML = "Temp: " + k2f(response.list[i].main.temp) + "\xB0F";
                        forecastEl[i].append(forecastTempEl);
                        let forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.innerHTML = "Humidity: " + response.list[i].main.humidity + "%";
                        forecastEl[i].append(forecastHumidityEl);
                    }
                })
            };
    
buttonEl.addEventListener("click",function() {
    let searchTerm = cityInputEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search",JSON.stringify(searchHistory));
    checkStorage();
    getSearchHistory();
    })
    
function getSearchHistory() {
        historyEl.innerHTML = "";
        for (let i=0; i<searchHistory.length; i++) {
            let historyItem = document.createElement("input");
            historyItem.setAttribute("type","text");
            historyItem.setAttribute("readonly",true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click",function() {
                getTodaysWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }
    
function checkStorage() {
        if(localStorage.getItem('search') === null) {
            document.querySelector('.col-8').style.display = "none";
        } else {
            document.querySelector('.col-8').style.display = 'block';
        }
    }
checkStorage();
     
