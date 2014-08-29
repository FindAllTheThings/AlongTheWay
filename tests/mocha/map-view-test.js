'use strict'

var chai = require('chai');
var Backbone = require('backbone');
var sinon = require('sinon');
var expect = chai.expect;

var MapView = require('../../app/js/maps/views/map-view');

describe('Backbone map view', function() {
  before(function(done) {
    sinon.spy(MapView.prototype, 'render');
    done();
  });

  it('should call render on load', function(done) {
    this.MapView = new MapView({model: Backbone.Model.extend({})});
    expect(MapView.prototype.render.called).to.be.true;
    done();
  });

  it('should not be empty', function(done) {
    expect(this.mapView.$el).to.not.eql('');
    done();
  });

  after(function(done) {
    MapView.prototype.render.restore();
    done();
  });
});
