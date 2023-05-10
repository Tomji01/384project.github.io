let map;
let correctLocations = 0;
let highScore = localStorage.getItem("highScore") || 0;
let currentLocation = 0;
const locations = [
  {
    name: "Sierra Tower",
    position: { lat: 34.23899138161388, lng: -118.53021073200863 },
  },

  { name: "The Soraya", position: { lat: 34.23620559227222, lng: -118.5281673056783 } },
  { name: "Monterey Hall", position: { lat: 34.2361909, lng: -118.5240869 } },
  {
    name: "Jacaranda Hall",
    position: { lat: 34.241250642830956, lng: -118.52882906138643}},
  ,
  { name: "Bayramian Hall", position: { lat: 34.2403636, lng: -118.5310838 } },
];

function initMap() {
  const mapOptions = {
    center: { lat: 34.242573, lng: -118.529456 },
    zoom: 16.4,
    mapTypeId: "satellite",
    draggable: false,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    disableTilt: true,
    gestureHandling: "none",
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  map.addListener("dblclick", (e) => {
    hideNotification();
    checkLocation(e.latLng);
  });

  promptNextLocation();
}

function checkLocation(userLatLng) {
  const location = locations[currentLocation];
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    userLatLng,
    location.position
  );

  const isCorrect = distance < 50;
  drawRectangle(location.position, isCorrect);

  if (isCorrect) {
    correctLocations++;
    if (correctLocations > highScore) {
      highScore = correctLocations;
      localStorage.setItem("highScore", highScore); // Store the new high score in localStorage
    }
    document.getElementById(
      "high-score"
    ).textContent = `High Score: ${highScore}`;
    document.getElementById(
      "score"
    ).textContent = `Score: ${correctLocations}/${locations.length}`;
    showNotification("Correct!");
  } else {
    showNotification("Incorrect.");
  }

  currentLocation++;
  promptNextLocation();
}

function showNotification(message, autoHide = true) {
  const notificationElement = document.getElementById("notification");
  notificationElement.innerHTML = message;
  notificationElement.style.display = "block";

  if (autoHide) {
    setTimeout(() => {
      notificationElement.style.display = "none";
    }, 3000);
  }
}

function hideNotification() {
  const notificationElement = document.getElementById("notification");
  notificationElement.style.display = "none";
}

function showResultNotification(message) {
  const resultNotificationElement = document.getElementById(
    "result-notification"
  );
  resultNotificationElement.innerHTML = message;
  resultNotificationElement.style.display = "block";

  setTimeout(() => {
    resultNotificationElement.style.display = "none";
  }, 3000);
}

function promptNextLocation() {
  const directionsElement = document.getElementById("directions");

  if (currentLocation < locations.length) {
    directionsElement.textContent = `Directions: Double click on ${locations[currentLocation].name}`;
  } else {
    directionsElement.textContent = `Game Finished!`;
  }
}
//Spotter Rectangle

function drawRectangle(position, isCorrect) {
  const rectangleSize = 200; 

  const northEast = google.maps.geometry.spherical.computeOffset(
    position,
    rectangleSize / Math.sqrt(2),
    45
  );
  const southWest = google.maps.geometry.spherical.computeOffset(
    position,
    rectangleSize / Math.sqrt(2),
    225
  );

  const rectangle = new google.maps.Rectangle({
    strokeColor: isCorrect ? "#008000" : "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: isCorrect ? "#008000" : "#FF0000",
    fillOpacity: 0.35,
    map: map,
    bounds: {
      north: northEast.lat(),
      south: southWest.lat(),
      east: northEast.lng(),
      west: southWest.lng(),
    },
  });
}
