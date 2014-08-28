'use strict'
/*jshint node: true*/
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var FormView = Backbone.View.extend({
  id:'form-view',
  events: {
    "change .route" : "getRouteParams",
    "change .places" : "getPlacesParams"
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    var template = require('../templates/form-view-template.hbs');
    this.$el.html(template());
    return this;
  },

  getRouteParams: function(){
    this.origin = this.$('#address').val();
    this.destination = this.$('#address2').val();
  },

  getPlacesParams: function(){
    this.radius = this.$("#radius").val();
    this.placeType = this.$('#place-type').val();
    this.keyword = this.$('#keyword').val();
  }

});

module.exports = FormView;
