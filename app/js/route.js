var map = require('./map');
var places = require('./places');
var directionsService = new google.maps.DirectionsService();



var RouteModel = {

  test: function(){
    console.log(map);
  },

  result: '',
  origin: '',
  destination: '',
  travelMode: '',

  setResult: function( result ){
    this.result = result;
  },

  setOrign: function( address ){
    this.origin = address;
  },

  setDestination: function( address ){
    this.destination = address;
  },

  setTravelMode: function( mode ){
    this.travelMode = mode;
  },

  getRequest: function(){
    return {
      origin: this.origin,
      destination: this.destination,
      travelMode: this.travelMode
    };
  },

  getRoute : function(){
    // clear map
    map.resetMap();

    // update route paramaters
    this.setOrigin( document.getElementById("address").value );
    this.setDestination( document.getElementById("address2").value );
    this.setTravelMode( google.maps.DirectionsTravelMode.DRIVING );

    // request a route
    directionsService.route( RouteModel.getRequest() , function(result, status) {

      if (status == google.maps.DirectionsStatus.OK) {

        RouteModel.setResult( result );

        map.renderRoute();

        places.findPlaces();

      } else {
        console.log('route request failed');
        console.log(status);
      }

    });
  }

};

module.exports = RouteModel;
