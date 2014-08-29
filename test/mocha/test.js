'use strict';
var chai = require('chai');
var expect = chai.expect;
var Map = require('../../app/js/maps/models/map-model');
var MapView = require('../../app/js/maps/views/map-view');

describe('a map model', function(){
  var map;

  beforeEach(function() {
    map = new Map();
  });

  it('instantiates a map object', function(){
    expect(map).to.have.property('attributes');
  });
  it('map model should have title "default title"', function(){
    expect(map.attributes.title).to.eql('default title');
  });
  it('map model should have option zoom of 16', function(){
    expect(map.attributes.options.zoom).to.eql(16);
  });
  it('map model should have option "center"', function(){
    expect(map.attributes.options.center).to.be.an('object');
  });

});
