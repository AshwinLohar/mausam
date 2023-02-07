const apiKey = "YOUR_API_KEY";

const sendHttpRequest = (method, url) => {
  const promise = new Promise((resolve, reject) => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, url);
    xmlhttp.responseType = "json";
    xmlhttp.onload = () => {
      resolve(xmlhttp.response);
    };
    xmlhttp.send();
  });
  return promise;
};

export function getWeather(location) {
  const promise = new Promise((resolve, reject) => {
    sendHttpRequest(
      "GET",
      "http://api.weatherapi.com/v1/forecast.json?key=" +
        apiKey +
        "&q=" +
        location +
        "&days=7&aqi=no&alerts=no"
    ).then((responseData) => {
      resolve(responseData);
    });
  });

  return promise;
}

export function getLocation(search_location) {
  const promise = new Promise((resolve, reject) => {
    sendHttpRequest(
      "GET",
      "http://api.weatherapi.com/v1/search.json?key=" +
        apiKey +
        "&q=" +
        search_location
    ).then((responseData) => {
      resolve(responseData);
    });
  });

  return promise;
}
