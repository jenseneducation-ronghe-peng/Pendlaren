import {
  requestNotificationPermission,
  createNotification,
} from "./notifications.js";
/*import { requestNotificationPermission } from "./notifications";
import { createNotification } from "./notifications";*/

import push from "./push-notifications.js";

//var getStationBtn = document.getElementById("getStationBtn");

window.addEventListener("load", getGolocation);

function getGolocation() {
  console.log("getting your location infor");
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      /*console.log(pos);*/
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      //console.log(latitude);
      //console.log(longitude);

      getPlace(latitude, longitude);
    },
    function (error) {
      console.log(error);
    }
  );
}

async function getPlace(latitude, longitude) {
  var geoLat = latitude.toFixed(6);
  var geoLong = longitude.toFixed(6);
  //console.log(geoLat, geoLong);

  /* nearby stop API guide:
  https://www.trafiklab.se/api/resrobot-reseplanerare/narliggande-hallplatser*/

  var baseURL = "https://api.resrobot.se/v2/location.nearbystops?key="; // Travel Planer - Nearby stop API URL
  var key = "c8193ae2-d679-446c-a5b0-006771519b68"; // Travel Planer - Nearby stop API key
  var inputURL =
    baseURL +
    key +
    "&originCoordLat=" +
    geoLat +
    "&originCoordLong=" +
    geoLong +
    "&format=json";

  var res = await fetch(inputURL);
  var myJson = await res.json();
  /*myJsObj = JSON.parse(JSON.stringify(myJson));*/

  console.log(myJson);

  var locationDiv = document.getElementById("location");
  var stations = myJson.StopLocation;

  stations.forEach((station) => {
    var stationName = station.name;
    var stationId = station.id;

    var stationDiv = document.createElement("div");
    stationDiv.setAttribute("class", "stationDiv");
    stationDiv.setAttribute("id", `div-${stationId}`);
    var addStation = document.createElement("h2");

    var busBtn = document.createElement("button");
    var subBtn = document.createElement("button");
    var tramBtn = document.createElement("button");

    var trafficDiv = document.createElement("div");
    trafficDiv.setAttribute("class", "trafficDiv");
    trafficDiv.setAttribute("id", `traffic-${stationId}`);
    // traffic choice
    busBtn.innerHTML = "Show Bus";
    busBtn.setAttribute("class", "busBtn");
    busBtn.setAttribute("id", `${stationId}-bus`);

    subBtn.innerHTML = "Show Subway";
    subBtn.setAttribute("class", "subwayBtn");
    subBtn.setAttribute("id", `${stationId}-sub`);

    tramBtn.innerHTML = "Show Tram";
    tramBtn.setAttribute("class", "tramBtn");
    tramBtn.setAttribute("id", `${stationId}-tram`);
    //
    addStation.innerHTML += stationName;
    locationDiv.appendChild(stationDiv);
    stationDiv.appendChild(addStation);

    stationDiv.appendChild(busBtn);
    stationDiv.appendChild(subBtn);
    stationDiv.appendChild(tramBtn);

    stationDiv.appendChild(trafficDiv);

    // show notification
    createNotification(stationName);
  });
  var findBus = document.querySelectorAll(".busBtn");
  var findSub = document.querySelectorAll(".subwayBtn");
  var findTram = document.querySelectorAll(".tramBtn");

  findBus.forEach((btn) => {
    var id = btn.id.slice(0, 9);
    //console.log(id);
    btn.addEventListener("click", getTimeTable);
    btn.myParam = id; // find online
    btn.trafficParam = "products=128&"; // find bus line
  });

  findSub.forEach((btn) => {
    var id = btn.id.slice(0, 9);
    //console.log(id);
    btn.addEventListener("click", getTimeTable);
    btn.myParam = id; // find online
    btn.trafficParam = "products=32&"; // find subway line
  });

  findTram.forEach((btn) => {
    var id = btn.id.slice(0, 9);
    //console.log(id);
    btn.addEventListener("click", getTimeTable);
    btn.myParam = id; // find online
    btn.trafficParam = "products=64&"; // find tram line
  });
}

async function getTimeTable(evt) {
  /* departure traffic API guide:
  https://www.trafiklab.se/api/resrobot-stolptidtabeller-2/dokumentation/avgaende-trafik

  oncoming traffic API guide:
  https://www.trafiklab.se/api/resrobot-stolptidtabeller-2/dokumentation/ankommande-trafik

  */

  var id = evt.currentTarget.myParam; // find online
  var bus = evt.currentTarget.trafficParam;
  var baseURL = "https://api.resrobot.se/v2/departureBoard?key="; // Travel Planer - Posting Table API URL
  var key = "b647f77b-b1ae-44e2-a6d7-8f9188d74ad1"; // Travel Planer - Posting Table API key
  var inputURL =
    baseURL + key + "&id=" + id + "&maxJourneys=5&" + bus + "format=json";

  var res = await fetch(inputURL);
  var myJson = await res.json();
  console.log(myJson);
  var departure = myJson.Departure;
  var trafficInfo = document.getElementById(`traffic-${id}`);

  if (departure) {
    trafficInfo.innerHTML = "";
    departure.forEach((el) => {
      var lineName = document.createElement("h4");
      lineName.innerHTML = "Line name: " + el.name + " (" + el.time + ")";

      var lineStop = document.createElement("p");
      lineStop.innerHTML = "(Go to: " + el.direction + ")";

      trafficInfo.appendChild(lineName);
      trafficInfo.appendChild(lineStop);
    });
  } else {
    trafficInfo.innerHTML = "";
    trafficInfo.innerHTML = "No traffic";
  }
}

/* ---------------------
Service Worker
------------------------ */

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("../sw.js")
      .then((registration) => {
        console.log("Registered service worker");
        push();
      })
      .catch((error) =>
        console.log("Error with register service worker", error)
      );
  }
}

registerServiceWorker();
requestNotificationPermission();

/*function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../sw.js')
      .then(() => console.log('Registered service worker'))
      .catch((error) => console.log('Error register service worker ', error));
  }
}

registerServiceWorker();*/
