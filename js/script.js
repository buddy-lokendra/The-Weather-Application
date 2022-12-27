// We Create a variable which holds our api Key
let weatherAPIKey = "ca6f250de27ac4e860467a0fdd791c90";
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Here we Creating Base EndPoint
// endPoint for Current-Weather-Details
let weatherBaseEndPoint =
  "https://api.openweathermap.org/data/2.5/weather?appid=" +
  weatherAPIKey +
  "&units=metric";

// endPoint for Forecast-Weather-Details
let forecastBaseEndPoint =
  "http://api.openweathermap.org/data/2.5/forecast?appid=" +
  weatherAPIKey +
  "&units=metric";

// endPoint for GeoCoding Api -> use for Suggestion of City
let geocodingBaseEndPoint =
  "http://api.openweathermap.org/geo/1.0/direct?limit=5&appid=" +
  weatherAPIKey +
  "&q=";

//
let geocodingBaseEndPointWithLatLon =
  "http://api.openweathermap.org/geo/1.0/reverse?appid=" + weatherAPIKey;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// creating JavaScript variable of html component
let searchInp = document.querySelector(".weather_search");
let city = document.querySelector(".weather_city");
let day = document.querySelector(".weather_day");
let humidity = document.querySelector(".weather_indicator--humidity>.value");
let wind = document.querySelector(".weather_indicator--wind>.value");
let pressure = document.querySelector(".weather_indicator--pressure>.value");
let image = document.querySelector(".weather_image");
let temperature = document.querySelector(".weather_temperature>.value");
let forecastBlock = document.querySelector(".weather_forecast");
let suggestion = document.querySelector("#suggestion");

// Array of Object , key -> url, ids-array
let weatherImages = [
  {
    url: "images/broken-clouds.png",
    ids: [803, 804],
  },
  {
    url: "images/clear-sky.png",
    ids: [800],
  },
  {
    url: "images/few-clouds.png",
    ids: [801],
  },
  {
    url: "images/mist.png",
    ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  },
  {
    url: "images/rain.png",
    ids: [500, 501, 502, 503, 504],
  },
  {
    url: "images/scattered-clouds.png",
    ids: [802],
  },
  {
    url: "images/shower-rain.png",
    ids: [520, 521, 531, 522, 300, 301, 302, 310, 311, 312, 313, 314, 321],
  },
  {
    url: "images/snow.png",
    ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  },
  {
    url: "images/thunderstorm.png",
    ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  },
];
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Extract Day-Name from millisecond
// Here we use concept of default arguments
// if dayOfWeek is called without any args then default-argument is applied
// if dayOfWeek is called with any args then default-argument is not applied
let dayOfWeek = (dt = new Date().getTime()) => {
  let today = new Date(dt).toLocaleDateString("en-En", { weekday: "long" });
  return today;
};
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

//   It is a arrow function
// It aim to make endpoint with city name
// and fire a  request to server and get response
// return this response in the form of json
// this function use promises to we use async and await here
let getWeatherByCityName = async (city) => {
  // console.log(city);
  let endPoint = weatherBaseEndPoint + "&q=" + city;
  let response = await fetch(endPoint);
  let weather = await response.json();
  return weather;
};
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// It is a arrow function
// It aim to make endpoint with city-ID
// and fire a  request to server and get response
// return this response in the form of json
// this function use promises to we use async and await here
// In Response , "list" property hold forecast details
let getForecastByCityId = async (id) => {
  let endPoint = forecastBaseEndPoint + "&id=" + id;
  let result = await fetch(endPoint);
  let forecast = await result.json();
  let forecastList = forecast.list;
  let daily = [];

  // Now our aim to filter object from list-array which have time = 12:00 PM
  forecastList.forEach((day) => {
    let date_txt = day.dt_txt;
    date_txt = date_txt.replace(" ", "T");
    let date = new Date(date_txt);
    let hours = date.getHours();
    if (hours === 12) {
      daily.push(day);
    }
  });
  return daily;
};
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Arrow Function use to set GUI-data fo Current-weather-component
let updateCurrentWeather = (data) => {
  // console.log("Data of object");
  // console.log(data);
  city.innerText = data.name;
  day.innerText = dayOfWeek();
  humidity.innerText = data.main.humidity;
  pressure.innerText = data.main.pressure;
  let windDirection;
  let deg = data.wind.deg;
  if (deg > 45 && deg <= 135) {
    windDirection = "East";
  } else if (deg > 135 && deg <= 225) {
    windDirection = "South";
  } else if (deg > 225 && deg <= 315) {
    windDirection = "West";
  } else {
    windDirection = "North";
  }
  wind.innerText = windDirection + "," + data.wind.speed;

  temperature.innerText =
    data.main.temp > 0
      ? "+" + Math.round(data.main.temp)
      : Math.round(data.main.temp);
  let imgID = data.weather[0].id;
  weatherImages.forEach((obj) => {
    if (obj.ids.indexOf(imgID) !== -1) {
      image.src = obj.url;
      image.title = data.weather[0].description;
    }
  });
};
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Arrow function use to set GUI-Date of forecast-weather-component
let updateForecast = (forecast) => {
  forecastBlock.innerHTML = "";
  let forecastItem = "";
  forecast.forEach((day) => {
    let iconUrl =
      "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png";
    let temperature =
      day.main.temp > 0
        ? "+" + Math.round(day.main.temp)
        : Math.round(day.main.temp);
    let dayName = dayOfWeek(day.dt * 1000);

    forecastItem += `<div class="col  px-lg-2 px-md-3 px-sm-2 px-5 my-3 my-xl-0 my-md-3 my-lg-2 my-sm-2">
    <div class="weather_forecast_item card text-center align-items-stretch">
      <div class="card-body ">
        <img
          src="${iconUrl}"
          alt="${day.weather[0].description}"
          title="${day.weather[0].description}"
          class="weather_forecast_icon card-img img-fluid py-2"
        />
        <h3 class="weather_forecast_day py-2">${dayName}</h3>
        <p class="weather_forecast_temperature">
          <span class="value">${temperature}</span> &deg;C
        </p>
      </div>
    </div>
  </div>`;
  });
  forecastBlock.innerHTML = forecastItem;
  suggestion.innerHTML = "";
};
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// this function use to easily track our code
// we make all call here related to current weather
let weatherForCity = async (city) => {
  // console.log(city);
  let weather = await getWeatherByCityName(city);
  if (weather.cod === "404") {
    Swal.fire({
      title: "OOPs.....",
      text: "You typed wrong city name",
      icon: "error",
    });
    return;
  }
  updateCurrentWeather(weather);
  let forecast = await getForecastByCityId(weather.id);
  updateForecast(forecast);
};
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// create eventListner on searchInp
searchInp.addEventListener("keydown", async (e) => {
  if (e.keyCode == 13) {
    weatherForCity(searchInp.value);
  }
});
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Create EventHandler for Suggestion
// Here we use "EVENT"  event , it fire when text in come inside text-box
searchInp.addEventListener("input", async () => {
  if (searchInp.value.length <= 2) {
    return;
  }
  let endpoint = geocodingBaseEndPoint + searchInp.value;
  let result = await fetch(endpoint);
  result = await result.json();
  suggestion.innerHTML = "";
  result.forEach((city) => {
    let option = document.createElement("option");
    option.value = `${city.name}${city.state ? "," + city.state : ""},${
      city.country
    }`;
    suggestion.appendChild(option);
  });
});

// Arrow function for
let getCityNameWithLatLon = async (lat, lon) => {
  let endPoint =
    geocodingBaseEndPointWithLatLon + "&lat=" + lat + "&lon=" + lon;
  let response = await fetch(endPoint);
  response = await response.json();
  let cityName = response[0].name;
  return cityName;
};

async function success(pos) {
  let crd = pos.coords;
  lat = crd.latitude.toString();
  lon = crd.longitude.toString();
  cityName = await getCityNameWithLatLon(lat, lon);
  weatherForCity(cityName);
  Swal.fire({ title: `Got your location : ${cityName}`, icon: "success" });
}

function error(err) {
  Swal.fire({
    title: "OOPs...",
    text: `${err.code},${err.msg}`,
    icon: "warning",
  });
}
async function getLatitudeLongitude() {
  let options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
  await window.navigator.geolocation.getCurrentPosition(
    success,
    error,
    options
  );
}
getLatitudeLongitude();
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
