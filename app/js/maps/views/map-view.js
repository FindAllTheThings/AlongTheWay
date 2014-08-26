/* jshint node: true */
'use strict';
var Backbone = require('backbone');
Backbone.$ = require('jquery');

var MapView = Backbone.View.extend({
  id: 'map-canvas',
  tagName: 'div',
  initialize: function(){
    this.directionsDisplay = new google.maps.DirectionsService();
    this.infowindow = new google.maps.InfoWindow();
    this.render();
  },
  render: function(){
    this.model.map = new google.maps.Map( this.$el, this.model.options);
    this.model.service = new google.maps.places.PlacesService( this.model.map );
    console.log(this.directionsDisplay);
    this.directionsDisplay.setMap(this.model.map);
    return this;
  }
});

module.exports = MapView;
