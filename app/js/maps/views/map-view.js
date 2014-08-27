/* jshint node: true */
'use strict';
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var GoogleMapsLoader = require('google-maps');

var MapView = Backbone.View.extend({
  id: 'map-canvas',
  tagName: 'div',
  initialize: function(){
    GoogleMapsLoader.LIBRARIES = 'places';
    GoogleMapsLoader.load();
    this.render();
  },
  render: function(){
    var _this = this;
    GoogleMapsLoader.onLoad(function(google){
      _this.map = new google.maps.Map( _this.el, _this.model.attributes.options);
      _this.directionsDisplay = new google.maps.DirectionsRenderer();
      _this.directionsDisplay.setMap(_this.map);
      _this.service = new google.maps.places.PlacesService(_this.map);
    });

    return this;
  },

});

module.exports = MapView;
