document.addEventListener("DOMContentLoaded", function (event) {  
    var appId = "c04cb915be53a048550a73855778b1d9"

    /**
   * takes API data (JSON/object) and turns it into elements on the page
   * @param {object} WeatherData - object containing current day weather
   * @param {object} UviData - object containing UV Index info
   * @param {object} ForecastData - object containing 5-day forecast info info
   */

    function renderCities() {

        var cities = JSON.parse(localStorage.getItem("cityList"));
        if (cities === null) {
            cities = [];
        }

        var cityInput = $("#city-input").val().trim();

        if (cityInput !== "") {
            cities.push(cityInput);
            cities = [...new Set(cities)]
        }
        $("#city-buttons").empty();
        console.log(cities);

        for (var i = 0; i < cities.length; i++) {

            var a = $("<button>");
            a.addClass("city-btn");
            a.attr("city-name", cities[i]);
            a.text(cities[i]);
            $("#city-buttons").append(a);
        }

        localStorage.setItem("cityList", JSON.stringify(cities));

    }

    renderCities();

    $(document).on("click", ".city-btn", function (event) {
        event.preventDefault();
        $("#city-input").empty();
        $("#city-input").val($(this).attr("city-name"));
    });

    $("#search-btn").on("click", function (event) {

        event.preventDefault();
 
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?";
        var queryParams = {
            "APPID": appId
            , "units": "imperial"
        };

        queryParams.q = $("#city-input")
            .val()
            .trim();
       
        var queryURL = queryURL + $.param(queryParams);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (WeatherData) {
            var queryURLuvi = "https://api.openweathermap.org/data/2.5/uvi?";
            let lat = WeatherData.coord.lat;
            let lon = WeatherData.coord.lon;
            var queryParamsUvi = { "appid": appId, "lat": lat, "lon": lon };

            var queryURLuvi = queryURLuvi + $.param(queryParamsUvi);

            $.ajax({
                url: queryURLuvi,
                method: "GET"
            }).then(function (UviData) {
          
                var weather = $("<div>");
                //City name
                let cityName = $("<div>").text("City: " + WeatherData.name);
                //Temperature
                let temp = $("<div>").text("Temperature: " + WeatherData.main.temp + " F");
                //Humidity
                let humidity = $("<div>").text("Humidity: " + WeatherData.main.humidity + "%");
                //Wind speed
                let wind = $("<div>").text("Wind: " + WeatherData.wind.speed + " mph");
                //UV index
                let uvIndex = $("<div>").text("UV index: " + UviData.value);

                weather.append(cityName).append(temp).append(humidity).append(wind).append(uvIndex);

                $("#current-weather").empty().append(weather);

                var queryURLforecast = "https://api.openweathermap.org/data/2.5/forecast?";

                let cityId = WeatherData.id;

                var paramsURLforecast = { "appid": appId, "id": cityId, "units": "imperial" };
              
                var queryURLcast = queryURLforecast + $.param(paramsURLforecast);
                console.log(queryURLcast);
              

                $.ajax({
                    url: queryURLcast,
                    method: "GET",
                    dataType: "json"
                }).then(function (ForecastData) {
                    console.log(ForecastData);
                    var forecast = ForecastData.list;
                    var dayCounter = 0;
                    var forecastWeek = []; 
                    var forecastDay = [];

                    for (var i = 0; i < forecast.length; i++) {
                    
                        var day = moment.unix(forecast[i].dt).utc();
                        today = moment.utc().add((dayCounter + 1), 'days');
                       
                        if (moment(today).isSame(day, 'day')) {  
                            forecastDay.push(forecast[i]);  
                        } else if (moment(today).isBefore(day, 'day')) { 
                            forecastWeek[dayCounter] = forecastDay;  
                            dayCounter++;  
                            forecastDay = [];  
                            forecastDay.push(forecast[i]);  
                        }

                    }
                    forecastWeek[dayCounter] = forecastDay; 

                    forecastWeek.forEach(renderDay);

                    renderCities();


                    function renderDay(forecastDay, index) {
            
                        var tempArr = [];
                        var tempTot = 0;
                        var humidTot = 0;

                        for (var i = 0; i < forecastDay.length; i++) {
                            tempArr.push(forecastDay[i].main.temp);
                            tempTot += forecastDay[i].main.temp;
                            humidTot += forecastDay[i].main.humidity;
                        }

                        var low = rounder((Math.min.apply(Math, tempArr)), 1);
                        var high = rounder((Math.max.apply(Math, tempArr)), 1);
                        var temp = rounder((tempTot / forecastDay.length), 1);
                        var humid = rounder(humidTot / forecastDay.length)
                        var date = moment.unix(forecastDay[1].dt).utc().format("dddd, MMM Do");  
                        var weather = (forecastDay[3].weather[0].description); 
                        var iconSym = icon(weather);

                        function rounder(value, decimal) {
                            var multiplier = Math.pow(10, decimal || 0);
                            return Math.round(value * multiplier) / multiplier;
                        }

                        var address = "#box-" + (index + 1);
                        var dayCast = $("<div>");
                        let dateDisp = $("<div>").text(date);
                    
                        let weatherDisp = $("<div>").html(iconSym);
                   

                        console.log(icon(weather));

                        let tempDisp = $("<div>").text("Temp: " + temp + "°F");
                        let humidDisp = $("<div>").text("Humidity: " + humid + "%");

                        let minDisp = $("<div>").text("Low: " + low);
                        let maxDisp = $("<div>").text("High: " + high);
                        dayCast.append(dateDisp).append(weatherDisp).append(tempDisp).append(humidDisp).append(minDisp).append(maxDisp);
                        $(address).empty().append(dayCast);

                    }

                });

            }.bind(WeatherData)); 

        });
    });

    function icon(desc) {
        let code = "";
        console.log(desc)
        switch (desc) {
            case "clear sky":
                code = "<i class='fas fa-sun' aria-hidden='true'></i>";
                break;
            case "few clouds":
                code = "<i class='fas fa-cloud-sun' aria-hidden='true'></i>";
                break;
            case "scattered clouds":
                code = "<i class='fas fa-cloud' aria-hidden='true'></i>";
                break;
            case "shower rain":
                code = "<i class='fas fa-cloud-rain' aria-hidden='true'></i>";
                break;
            case "rain":
                code = "<i class='fas fa-cloud-showers-heavy' aria-hidden='true'></i>";
                break;
            case "thunderstorm":
                code = "<i class='fas fa-bolt' aria-hidden='true'></i>";
                break;
            case "snow":
                code = "<i class='fas fa-snowflake' aria-hidden='true'></i>";
                break;
            case "mist":
                code = "<i class='fas fa-smog' aria-hidden='true'></i>"
                break;
            case "broken clouds":
                code = "<i class='fas fa-cloud-sun' aria-hidden='true'></i>";
                break;
            default: code = "<i class='fas fa-cloud' aria-hidden='true'></i>";
        
        }
        console.log(code)
        return code;
    }

});

