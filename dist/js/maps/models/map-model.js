/* jshint node: true */
'use strict';
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var MapModel = Backbone.Model.extend({
  defaults: {
    title: 'default title',
    options: {
      zoom: 16,
      center: {lat: 47.6097, lng: -122.3331}
    },
  }
});

module.exports = MapModel;
