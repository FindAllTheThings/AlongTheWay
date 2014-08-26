var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var service;
var infowindow;
var markers = [];

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 16,
    center: {lat: 47.6097, lng: -122.3331}
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  directionsDisplay.setMap(map);
  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
}

window.calcRoute = function() {
  // Clear any previous route boxes from the map
  deleteMarkers();

  var request = {
    origin: document.getElementById("address").value,
    destination: document.getElementById("address2").value,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };

// Make the directions request
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {

      directionsDisplay.setDirections(result);
      var path = result.routes[0].overview_path;
      findPlaces(path, 0);

    } else {
      alert("Directions query failed: " + status);
    }
  });
}

function findPlaces(path, index) {
 var type = document.getElementById('place-type').value;
 var radius = document.getElementById('radius').value * 1609.34;
 var timeout = 50;

 function loop() {
   var request = {
     location: path[index],
     radius: radius,
     types: [type]
   };
   service.radarSearch(request, function (results, status) {
     if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
       return;
     }
     if (status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {

       timeout += timeout;
       return;
     }

     timeout = 50;

     for (var i = 0, result; result = results[i]; i++) {
       var marker = createMarker(result);
     }

   });
   if (index++ < path.length)
    setTimeout(loop, timeout);
  }
  loop();
}

function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  markers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        console.log(status);
        return;
      }
      name = result.name;
      add = result.formatted_address;
      infowindow.setContent('<p>' + name + '</p><p>' + add + '</p>');
      infowindow.open(map, marker);
    });
  });
}

function deleteMarkers() {
  setAllMap(null);
  markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);
