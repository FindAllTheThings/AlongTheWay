'use strict'

var chai = require('chai');
var sinon = require('sinon');
var Backbone = require('backbone');
var expect = chai.expect;

var Map = require('../../../app/js/maps/models/map-model');

describe('Map model', function(){
  before(function(done) {
    this.mock = sinon.mock(Backbone);
    map = new Map();
    done();
  });

  it('should be a backbone object', function(done) {
    map.set('title', 'default title');
    expect(map).to.be.ok;
    expect(map.get('title')).to.eql('default title');
    done();
  });

  after(function() {
    this.mock.verify();
  });
});
