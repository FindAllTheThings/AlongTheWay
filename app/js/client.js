var $ = require('jquery');
var Map = require('./maps/models/map-model');
var MapView = require('./maps/views/map-view');
var FormView = require('./maps/views/form-view');

var map = new Map();
var mapView = new MapView({model: map});
var formView = new FormView();

$(function(){

    $('#map-canvas').html(mapView.el);

    function watchLocation(){
      if(navigator.geolocation){
        navigator.geolocation.watchPosition(mapView.updateLocation);
      } else {
        console.log('location services unavailable');
      }
    }

    watchLocation();

});
