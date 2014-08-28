'use strict';
/*jshint node: true */
var $ = require('jquery');
var MapModel = require('./maps/models/map-model');
var MapView = require('./maps/views/map-view');

var map = new MapModel();
var mapView = new MapView({model: map});


$(function(){

    $('#map-canvas').html(mapView.el);


});
