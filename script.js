import { getWeather, getLocation } from "./hide.js";
window.getData = getData;
window.search = search;

/*-----default_locations-----*/
const default_locations = [
  "Bombay, Maharashtra, India",
  "New Delhi, Delhi, India",
  "Windsor, Ontario, Canada",
  "New York, New York, United States of America",
  "London, City of London, Greater London, United Kingdom",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function resetLocations() {
  let s = document.querySelector(".suggestion");
  s.innerHTML = "";
  for (var i = 0; i < default_locations.length; i++) {
    let temp = document.createElement("a");
    temp.href = "javascript:getData(" + i + ")";
    temp.className = "suggestion_options";
    temp.id = i;
    temp.innerHTML = default_locations[i];
    s.append(temp);
  }
}

var highlighted = null;

let search_box = document.getElementById("search_box");
search_box.addEventListener("keydown", (e) => {
  if (e.code == "Enter" && highlighted == null) {
    search();
  } else if (e.code == "Enter" && highlighted != null) {
    getData(highlighted);
    highlighted = null;
    search_box.blur();
  }
});
search_box.addEventListener("keydown", (e) => {
  let sugg_opts = document.querySelectorAll(".suggestion_options");
  if (e.code == "ArrowDown") {
    if (highlighted == null) {
      highlighted = 0;
      sugg_opts[highlighted].style.fontSize = "1.05em";
    } else if (highlighted < sugg_opts.length - 1) {
      sugg_opts[highlighted].style.fontSize = "1em";
      highlighted += 1;
      sugg_opts[highlighted].style.fontSize = "1.05em";
    } else if (highlighted < sugg_opts.length) {
      sugg_opts[highlighted].style.fontSize = "1em";
      highlighted = 0;
      sugg_opts[highlighted].style.fontSize = "1.05em";
    }
  } else if (e.code == "ArrowUp") {
    if (highlighted == null) {
      highlighted = sugg_opts.length - 1;
      sugg_opts[highlighted].style.fontSize = "1.05em";
    } else if (highlighted >= 1) {
      sugg_opts[highlighted].style.fontSize = "1em";
      highlighted -= 1;
      sugg_opts[highlighted].style.fontSize = "1.05em";
    } else if (highlighted < 1) {
      sugg_opts[highlighted].style.fontSize = "1em";
      highlighted = sugg_opts.length - 1;
      sugg_opts[highlighted].style.fontSize = "1.05em";
    }
  }
});

export function search() {
  let search_location = document.getElementById("search_box").value;
  let s = document.querySelector(".suggestion");

  getLocation(search_location).then((myObj) => {
    s.innerHTML = "";
    for (var i = 0; i < myObj.length; i++) {
      let temp = document.createElement("a");
      temp.href = "javascript:getData(" + i + ")";
      temp.className = "suggestion_options";
      temp.id = i;
      temp.innerHTML =
        myObj[i].name + ", " + myObj[i].region + ", " + myObj[i].country;
      s.append(temp);
    }
  });
}

/*-----seach_option_eventlistner-----*/
export function getData(i) {
  let temp = document.getElementsByClassName("suggestion_options");
  var location = temp[i].innerHTML;
  getWeather(location).then((myObj) => {
    setBackground(myObj);
    let data = [myObj.current.temp_c, myObj.location.name];
    const d = new Date(myObj.location.localtime);
    data.push(
      pad(d.getHours()) +
        ":" +
        pad(d.getMinutes()) +
        " - " +
        weekday[d.getDay()] +
        ", " +
        pad(d.getDate()) +
        " " +
        months[d.getMonth()] +
        " " +
        (d.getFullYear() % 100)
    );
    data.push(
      myObj.current.condition.icon,
      myObj.current.condition.text,
      myObj.current.feelslike_c,
      myObj.current.humidity,
      myObj.current.uv,
      myObj.current.wind_kph,
      myObj.current.wind_dir,
      myObj.current.cloud,
      myObj.current.precip_mm,
      myObj.current.pressure_mb,
      myObj.current.vis_km
    );
    assignValues(data);
    assignHourly(myObj);
    assignFutureForecast(myObj);
    resetLocations();
    document.getElementById("search_box").value = "";
  });
}

function pad(number) {
  return (number < 10 ? "0" : "") + number;
}

function assignValues(data) {
  const c = document.querySelector(".current");
  c.style.display = "flex";
  document.getElementById("current_temp").innerHTML = data[0] + "°C";
  document.getElementById("location").innerHTML = data[1];
  document.getElementById("time").innerHTML = data[2];
  document.getElementById("current_icon").src = data[3];
  document.getElementById("current_condition").innerHTML = data[4];
  let field = document.querySelectorAll(".weather_item_field");
  field[0].innerHTML = data[5] + " °C";
  field[1].innerHTML = data[6] + " %";
  field[2].innerHTML = data[7];
  field[3].innerHTML = data[8] + " kmph";
  field[4].innerHTML = data[9];
  field[5].innerHTML = data[10] + " %";
  field[6].innerHTML = data[11] + " %";
  field[7].innerHTML = data[12] + " mb";
  field[8].innerHTML = data[13] + " km";
}

function assignHourly(myObj) {
  const hrly = document.querySelector(".hourly_section");
  hrly.innerHTML = "";
  hrly.style.display = "flex";
  for (var i = 0; i < 24; i++) {
    let h = document.createElement("div");
    h.className = "hour";
    let p1 = document.createElement("p");
    p1.innerHTML = pad(i) + ":00";
    let p2 = document.createElement("p");
    p2.innerHTML = myObj.forecast.forecastday[0].hour[i].temp_c + " °C";
    let img = document.createElement("img");
    img.src = myObj.forecast.forecastday[0].hour[i].condition.icon;
    img.alt = myObj.forecast.forecastday[0].hour[i].condition.text;
    h.insertAdjacentElement("beforeend", p1);
    h.insertAdjacentElement("beforeend", img);
    h.insertAdjacentElement("beforeend", p2);
    hrly.append(h);
  }
}
function assignFutureForecast(myObj) {
  const ftfr = document.querySelector(".future_forecast");
  ftfr.innerHTML = "";
  ftfr.style.display = "flex";
  for (var i = 0; i < myObj.forecast.forecastday.length; i++) {
    let temp = document.createElement("div");
    temp.className = "future_forecast_item";
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let img = document.createElement("img");
    const day = new Date(myObj.forecast.forecastday[i].date);
    p1.innerHTML = weekday[day.getDay()];
    p2.innerHTML = myObj.forecast.forecastday[i].day.condition.text;
    p3.innerHTML = myObj.forecast.forecastday[i].day.avgtemp_c + " °C";
    img.src = myObj.forecast.forecastday[i].day.condition.icon;
    img.alt = myObj.forecast.forecastday[i].day.condition.text;
    temp.insertAdjacentElement("beforeend", p1);
    temp.insertAdjacentElement("beforeend", img);
    temp.insertAdjacentElement("beforeend", p2);
    temp.insertAdjacentElement("beforeend", p3);
    ftfr.append(temp);
  }
}

function setBackground(myObj) {
  let b = document.querySelector("#body");
  var c = myObj.current.condition.text.toLowerCase();
  var result = isDay(myObj);
  if (c.includes("sunny")) {
    b.style.backgroundImage = "url('assets/sunny.jpg')";
  } else if (c.includes("clear")) {
    b.style.backgroundImage = "url('assets/clear.jpg')";
  } else if (c.includes("cloudy")) {
    if (result) {
      b.style.backgroundImage = "url('assets/day_cloudy.jpg')";
    } else {
      b.style.backgroundImage = "url('assets/night_cloudy.jpg')";
    }
  } else if (c.includes("overcast")) {
    if (result) {
      b.style.backgroundImage = "url('assets/day_overcast.jpg')";
    } else {
      b.style.backgroundImage = "url('assets/night_overcast.jpg')";
    }
  } else if (c.includes("mist")) {
    if (result) {
      b.style.backgroundImage = "url('assets/day_mist.jpg')";
    } else {
      b.style.backgroundImage = "url('assets/night_mist.jpg')";
    }
  } else if (c.includes("thunder")) {
    if (result) {
      b.style.backgroundImage = "url('assets/day_thunder.jpg')";
    } else {
      b.style.backgroundImage = "url('assets/night_thunder.jpg')";
    }
  } else if (
    c.includes("rain") ||
    c.includes("sleet") ||
    c.includes("drizzle")
  ) {
    if (result) {
      b.style.backgroundImage = "url('assets/day_rain.jpg')";
    } else {
      b.style.backgroundImage = "url('assets/night_rain.jpg')";
    }
  } else if (
    c.includes("snow") ||
    c.includes("blizzard") ||
    c.includes("pellets")
  ) {
    if (result) {
      b.style.backgroundImage = "url('assets/day_snow.jpg')";
    } else {
      b.style.backgroundImage = "url('assets/night_snow.jpg')";
    }
  } else if (c.includes("fog")) {
    if (result) {
      b.style.backgroundImage = "url('assets/day_fog.jpg')";
    } else {
      b.style.backgroundImage = "url('assets/night_fog.jpg')";
    }
  }
}

function isDay(myObj) {
  var d = new Date(myObj.location.localtime);
  var time = d.getHours();
  var day = myObj.forecast.forecastday[0].hour[time].is_day;
  if (day) {
    return true;
  } else {
    return false;
  }
}
/*-----for_horizontal_scroll-----*/
const section = document.querySelector(".hourly_section");
section.addEventListener("wheel", function (e) {
  if (e.deltaY > 0) {
    section.scrollLeft += 115;
    e.preventDefault();
  } else {
    section.scrollLeft -= 115;
    e.preventDefault();
  }
});
/*-----for_horizontal_scroll_end-----*/

resetLocations();
