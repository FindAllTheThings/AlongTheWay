var $ = require('jquery');
var Map = require('./maps/models/map-model');
var MapView = require('./maps/views/map-view');

var map = new Map();
var mapView = new MapView({model: map});

$(function(){

    $('#map-wrapper').html(mapView.el);

    // bind handle
    $('#overlay-handle').on('click',function(){
      $('#options-wrapper').toggleClass('open');
    });

    // close overlay on execute
    $('#go').on('click', function(){
      $('#options-wrapper').toggleClass('open');
    });

});
