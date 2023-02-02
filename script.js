const apiKey = "72b830125cec4469997133741230901";

/*-----setting_button_color-----*/
const div = document.querySelector("#body");
const style = window.getComputedStyle(div, false);
const bi = style.backgroundImage.slice(-12, -6);
console.log(bi);
document.getElementById("search_button").style.backgroundColor = "#" + bi;

/*-----default_locations-----*/
default_locations = [
  "Birmingham",
  "Manchester",
  "New York",
  "California",
  "New York",
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

function search() {
  search_location = document.getElementById("search_box").value;
  const location_list = [];
  let s = document.querySelector(".suggestion");

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open(
    "GET",
    "http://api.weatherapi.com/v1/search.json?key=" +
      apiKey +
      "&q=" +
      search_location
  );
  xmlhttp.send();
  xmlhttp.onload = function () {
    const myObj = JSON.parse(this.responseText);
    s.innerHTML = "";
    for (var i = 0; i < myObj.length; i++) {
      let temp = document.createElement("a");
      temp.href = "javascript:getData(" + i + ")";
      temp.className = "suggestion_options";
      temp.id = i;
      temp.innerHTML = myObj[i].name;
      s.append(temp);
    }
  };
}

/*-----seach_option_eventlistner-----*/
function getData(i) {
  let temp = document.getElementsByClassName("suggestion_options");
  var location = temp[i].innerHTML;
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open(
    "GET",
    "http://api.weatherapi.com/v1/forecast.json?key=" +
      apiKey +
      "&q=" +
      location +
      "&days=7&aqi=no&alerts=no"
  );
  xmlhttp.send();
  xmlhttp.onload = function () {
    const myObj = JSON.parse(this.responseText);
    console.log(myObj);
    data = [];
  };
}

resetLocations();
