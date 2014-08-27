/* jshint node: true */
'use strict';
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var GoogleMapsLoader = require('google-maps');
var FormView = require('./form-view');

var MapView = Backbone.View.extend({
  id: 'map-canvas',
  tagName: 'div',

  events: {
    "click #overlay-handle": "show"
  },

  initialize: function(){
    GoogleMapsLoader.LIBRARIES = 'places';
    GoogleMapsLoader.load();
    this.render();
    this.loader();
    //this.on('render', this.onRender);
    //this.optionbutton();
  },

  loader: function() {
    var _this = this;
    console.log(this);
    console.log(this.$el);
    GoogleMapsLoader.onLoad(function(google){
      _this.map = new google.maps.Map( _this.$('#map-wrapper').get(0), _this.model.attributes.options);
      _this.directionsDisplay = new google.maps.DirectionsRenderer();
      _this.directionsDisplay.setMap(_this.map);
      _this.service = new google.maps.places.PlacesService(_this.map);

    });
  },

  render: function(){
    var template = require('../templates/map-template.hbs');
    this.$el.html(template());
    return this;
  },

  // optionbutton: function() {
  //   id: 'options-wrapper';
  //   var template = require('../templates/options-template.hbs');
  //   this.$el.append(template());
  //   return this;
  // },

  show: function() {
    console.log('handler clicked');
    var formView = new FormView({model: this.model});
    console.log(formView.el);
    this.$('#options-wrapper').html(formView.el);
    this.$('#options-wrapper').toggleClass('open');
  },

});

module.exports = MapView;
