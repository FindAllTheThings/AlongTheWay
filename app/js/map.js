var route = require('./route');

var MapModel = {
  // attributes
  map: '',
  service: '',
  infowindow: '',
  markers: [],
  directionsDisplay: '',
  options: {
    zoom: 16,
    center: {lat: 47.6097, lng: -122.3331}
  },

  // behaviors
  reset: function(){
    for (var i = 0; i < MapModel.markers.length; i++) {
      MapModel.markers[i].setMap(null);
    }
    MapModel.markers = [];
  },

  renderRoute: function(){
    directionsDisplay.setDirections( route.result );
  },

  init: function(){
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.map = new google.maps.Map( document.getElementById('map-canvas'), this.options);
    this.directionsDisplay.setMap(this.map);
    this.infowindow = new google.maps.InfoWindow();
    this.service = new google.maps.places.PlacesService( this.map );
  }
  
};

module.exports = MapModel;
