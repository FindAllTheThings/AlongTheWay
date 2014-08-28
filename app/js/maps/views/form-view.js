'use strict'
//form-view.js

var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var FormView = Backbone.View.extend({
  id:'blowme',

  initialize: function() {
    console.log('backbone sucks');
    this.render();

  },

  render: function() {
    console.log('now rendering');
    var template = require('../templates/form-view-template.hbs');
    this.$el.html(template());
    return this;
  }
});

module.exports = FormView;
