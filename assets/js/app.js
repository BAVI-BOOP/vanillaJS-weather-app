const WEATHER_API_KEY = "16abc53de8b4570d8b628832d642710f";

const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");
const forecast = document.getElementById("forecast");
const accordion = document.getElementById("accordionFlushExample");

// Default input when the page loads
let cityInput = "London";
app.style.opacity = 1;
// add click event for each city in the panel
cities.forEach((city) => {
  city.addEventListener("click", (event) => {
    // Change from default city to the clicked one
    cityInput = event.target.innerHTML;
    /* Function that fetched and displays all the data from the Weather API */
    saveWeather();
    app.style.opacity = 1;
  });
});
// Add submit event to the form
form.addEventListener("submit", (event) => {
  // if the input field (search bar) is empty, throw an alert
  if (search.value.length == 0) {
    alert("Please type in a city name");
  } else {
    /* Change from default city to the one written in the input field */
    cityInput = search.value;
    /* Function that fetched and displays all the data from the Weather API */
    // Fade out the app (simple animation)
    saveWeather();
    app.style.opacity = 1;
    search.value = "";
  }
  //Prevents the default behaviour of the form
  event.preventDefault();
});

/* Function that returns a day of the week (Monday, Tuesday, Friday....) from a date (12 03 2021) We will use this function later */
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return weekday[new Date(`${day}/${month}/${year}`).getDay];
}

/* Function that fetched and displays the data from the weather API */

// as
function saveWeather() {
  let lon;
  let lat;

  return fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=${1}&appid=${WEATHER_API_KEY}`
  )
    .then((response) => response.json())
    .then((jsonResponse) => {
      lon = jsonResponse[0].lon;
      lat = jsonResponse[0].lat;
      return fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      )
        .then((response) => response.json())
        .then((jsonResponse) => {
          console.log(jsonResponse);
          temp.innerText = Math.round(jsonResponse.main.temp);
          conditionOutput.innerHTML = jsonResponse.weather[0].description;
          // To get the time
          d = new Date();
          localTime = d.getTime();
          localOffset = d.getTimezoneOffset() * 60000;
          utc = localTime + localOffset;
          var x = utc + 1000 * jsonResponse.timezone;
          nd = new Date(x);
          console.log(nd);
          let weatherIcon = jsonResponse.weather[0].icon;
          let current_time = nd.toString().split(" ");
          timeOutput.innerText = current_time[4];
          dateOutput.innerText = `${current_time[0]} ${current_time[1]} ${current_time[2]}`;
          nameOutput.innerHTML = jsonResponse.name;
          icon.src = `./assets/icons/${weatherIcon}.png`;
          cloudOutput.innerHTML = jsonResponse.clouds.all + "%";
          humidityOutput.innerHTML = jsonResponse.main.humidity + "%";
          windOutput.innerHTML = jsonResponse.main.humidity + "km/h";
          let timeOfDay = "day";
          let hour = current_time[4].split(":")[0];
          if (parseInt(hour) > 19 || parseInt(hour) < 5) {
            timeOfDay = "night";
          }

          if (weatherIcon == "01d" || weatherIcon == "01n") {
            app.style.backgroundImage = `url(./assets/images/${timeOfDay}/clear.jpg)`;
            btn.style.background = "#e5ba92";
            if (timeOfDay == "night") {
              btn.style.background = "#181e27";
            }
          } else if (
            weatherIcon == "02d" ||
            weatherIcon == "02n" ||
            weatherIcon == "03d" ||
            weatherIcon == "03n" ||
            weatherIcon == "04d" ||
            weatherIcon == "04n"
          ) {
            app.style.backgroundImage = `url(./assets/images/${timeOfDay}/cloudy.jpg)`;
            btn.style.background = "#fa6d1b";
            if (timeOfDay == "night") {
              btn.style.background = "#181e27";
            }
          } else if (
            weatherIcon == "09d" ||
            weatherIcon == "09n" ||
            weatherIcon == "10d" ||
            weatherIcon == "10n" ||
            weatherIcon == "11d" ||
            weatherIcon == "11n"
          ) {
            app.style.backgroundImage = `url(./assets/images/${timeOfDay}/rainy.jpg)`;
            btn.style.background = "#647d75";
            if (timeOfDay == "night") {
              btn.style.background = "#325c80";
            }
          } else {
            app.style.backgroundImage = `url(./assets/images/${timeOfDay}/snowy.jpg)`;
            btn.style.background = "#4d72aa";
            if (timeOfDay == "night") {
              btn.style.background = "#1b1b1b";
            }
          }
          app.style.opacity = "1";
          forecast.style.opacity = "1";
          return fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              const WEEK_DAYS = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ];
              const number = [
                "One",
                "Two",
                "Three",
                "Four",
                "Five",
                "Six",
                "Seven",
              ];
              const currentDay = new Date().getDay();
              const forecastDays = WEEK_DAYS.slice(
                currentDay,
                WEEK_DAYS.length
              ).concat(WEEK_DAYS.slice(0, currentDay));
              accordion.innerHTML = "";
              data.list.slice(0, 6).map((item, idx) => {
                accordion.innerHTML += ` 

              
              <div class="accordion-item">
    <h2 class="accordion-header" id="flush-heading${number[idx]}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${
        number[idx]
      }" aria-expanded="false" aria-controls="flush-collapse${number[idx]}">
      ${forecastDays[idx]}
      </button>
    </h2>
    <div id="flush-collapse${
      number[idx]
    }" class="accordion-collapse collapse" aria-labelledby="flush-heading${
                  number[idx]
                }" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body">
      <div class="daily-details-grid">
      <div class="daily-details-grid-item">
        <label>Pressure:</label>
        <label>${item.main.pressure} hPa</label>
      </div>
      <div class="daily-details-grid-item">
        <label>Humidity:</label>
        <label>${item.main.humidity}%</label>
      </div>
      <div class="daily-details-grid-item">
        <label>Clouds:</label>
        <label>${item.clouds.all}%</label>
      </div>
      <div class="daily-details-grid-item">
        <label>Wind speed:</label>
        <label>${item.wind.speed} m/s</label>
      </div>
      <div class="daily-details-grid-item">
        <label>Sea Level:</label>
        <label>${item.main.sea_level}m</label>
      </div>
      <div class="daily-details-grid-item">
        <label>Feels ike:</label>
        <label>${Math.round(item.main.feels_like)}°C</label>
      </div> 
      </div>
    </div>
  </div>
                `;
              });
            });
        });
    });
}

forecast.addEventListener("click", function () {
  accordion.classList.toggle("visible");
});
