/* jshint node: true */
'use strict';
var $ = require('jquery');
var _ = require('lodash');
var Backbone = require('backbone');
Backbone.$ = $;

var GoogleMapsLoader = require('google-maps');
var FormView = require('./form-view');

var MapView = Backbone.View.extend({
  id: 'map-view',
  places: [],
  events: {
    "click #overlay-handle": "show",
    "click #go":"getRoute"
  },

  initialize: function(){
    var _this = this;
    GoogleMapsLoader.LIBRARIES = 'places';
    GoogleMapsLoader.load();
    this.render();
    this.loader();
  },

  loader: function() {
    var _this = this;
    GoogleMapsLoader.onLoad(function(google){
      _this.google = google;
      _this.map = new _this.google.maps.Map( _this.$('#map-wrapper').get(0), _this.model.attributes.options);
      _this.directionsDisplay = new _this.google.maps.DirectionsRenderer();
      _this.directionsDisplay.setMap(_this.map);
      _this.service = new _this.google.maps.places.PlacesService(_this.map);
      _this.directionsService = new _this.google.maps.DirectionsService();
      _this.infowindow = new _this.google.maps.InfoWindow();
      _this.initializeGeolocation();
    });
  },

  initializeGeolocation:function(){
    var _this = this;
    if(navigator.geolocation){
      navigator.geolocation.watchPosition(function(position){
        var p = new _this.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        _this.makeMapMarker({
          geometry:{
            location: p
          },
          customIcon: 'location-marker.png'
        });
      });
    } else {
      console.log('location services unavailable');
    }
  },

  render: function(){
    // render map template
    var template = require('../templates/map-template.hbs');
    this.$el.html(template());

    // add form subview
    this.formView = new FormView({model: this.model});
    this.$('#opt-inner-wrapper').html(this.formView.el);

    return this;
  },

  show: function() {
    this.$('#options-wrapper').toggleClass('open');
    return this;
  },

  getRoute: function(){
    var _this = this;
    this.show();

    this.formView.getRouteParams();
    this.formView.getPlacesParams();

    var request = {
      origin: this.formView.origin,
      destination: this.formView.destination,
      travelMode: _this.google.maps.DirectionsTravelMode.DRIVING
    };

    this.directionsService.route(request, function(result,status){
      if(status == _this.google.maps.DirectionsStatus.OK){
        _this.directionsDisplay.setDirections(result);
        _this.routeResult = result;
        _this.getPlaces();
      }
    });
  },

  getPlaces: function(){
    var _this = this;
    var timeout = 0;
    var index = 0;

    loopRequest();

    function loopRequest(){
      var request = {
        location: _this.routeResult.routes[0].overview_path[index],
        radius: _this.formView.radius * 1609.34,
        types: [_this.formView.placeType],
        keyword: _this.formView.keyword,
        openNow: true
      };

      if(request.types === 'restaurant') request.minPriceLevel = 1;

      _this.service.nearbySearch(request, function(results,status){
        if(status == _this.google.maps.places.PlacesServiceStatus.ZERO_RESULTS){
          // console.log('status: ' + status);
        } else if (status == _this.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT){
          timeout += timeout + 1;
        } else{
          // reset timeout
          timeout = 0;

          // for each returned place
          for (var i = 0; i < results.length; i++) {
            var thisPlace = results[i];
            _this.addPlace(thisPlace);
          }
        }
        // loop

        var percentProgress = index/_this.routeResult.routes[0].overview_path.length * 100;
        _this.$('#progress-bar').css('width', percentProgress + '%');
        console.log(percentProgress);

        if(index++ < _this.routeResult.routes[0].overview_path.length){
          setTimeout(loopRequest,timeout);
        }

      });
    }
  },

  addPlace: function(place){
    var thisPlace = place;
    // add to places array
    if( _.where( this.places, {'place_id':thisPlace.place_id}).length > 0 ){
      // dupliacte
    } else {
      // add to places array
      this.places.push(thisPlace);

      this.makeMapMarker(thisPlace);

      // add a list item
      var rating = thisPlace.rating ? thisPlace.rating : 'no rating';
      var types = thisPlace.types.join(" ");

      this.$('#results-section ul')
        .append('<li class="results-item '+types+'"><a>'+thisPlace.name+'<a/><p>'+rating+'</p></li>');

    }
  },

  makeMapMarker: function(thisPlace){
    var _this = this;
    // create a map marker
    var pin = new this.google.maps.Marker({
      map: this.map,
      position: thisPlace.geometry.location
    });

    if( !!thisPlace.customIcon ){
      pin.setIcon(thisPlace.customIcon);
    }

    if( !thisPlace.customIcon){
      this.google.maps.event.addListener(pin,'click',function(){
        // console.log(_this.infowindow);
        _this.infowindow.setContent('<p>'+thisPlace.name+'</p>');
        _this.infowindow.open(_this.map, pin);
      });
    }
  }

});

module.exports = MapView;
