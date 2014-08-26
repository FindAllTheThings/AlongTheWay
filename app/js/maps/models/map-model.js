/* jshint node: true */
'use strict';
var Backbone = require('backbone');
Backbone.$ = require('jquery');

var Map = Backbone.Model.extend({

  defaults: {
    map: '',
    service: '',
    infowindow: '',
    markers: [],
    options: {
      zoom: 16,
      center: {lat: 47.6097, lng: -122.3331}
    },
  },

  initialize: function(){
    //this.map = new google.maps.Map( document.getElementById('map-canvas'), this.options);
    //this.directionsDisplay.setMap(this.map);
    this.infowindow = new google.maps.InfoWindow();
    this.service = new google.maps.places.PlacesService( this.map );
  }

});

module.exports = Map;
