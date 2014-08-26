var map = require('./map');
var route = require('./route');

var PlacesModel = {

  findPlaces: function(){

    var path = route.result.routes[0].overview_path;

    findPlaces(path, 0);

  }

};

module.exports = PlacesModel;

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
