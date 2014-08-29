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
  markers: [],
  events: {
    "click #overlay-handle": "show",
    "click #go":"getRoute",
    "click #back-to-top": "goBackToTop",
    "click .mapPin" : "addDetails",
    "click #clear": "deleteMarkers"
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
      // cache the google maps object to view
      _this.google = google;
      // initialize services
      _this.map = new _this.google.maps.Map( _this.$('#map-wrapper').get(0), _this.model.attributes.options);
      _this.directionsDisplay = new _this.google.maps.DirectionsRenderer();
      _this.directionsDisplay.setMap(_this.map);
      _this.service = new _this.google.maps.places.PlacesService(_this.map);
      _this.directionsService = new _this.google.maps.DirectionsService();
      _this.infowindow = new _this.google.maps.InfoWindow();
      _this.autocomplete1 = new google.maps.places.Autocomplete(document.getElementById('address'))
      _this.autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('address2'))
      // initialize browser's geolocation service
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
          customIcon: 'icons/location-marker.png',
          name: 'You are here!'
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

    // show/hide form
    this.show();

    // update route paramaters
    this.formView.getRouteParams();
    this.formView.getPlacesParams();

    // create a request object
    var request = {
      origin: this.formView.origin,
      destination: this.formView.destination,
      travelMode: _this.google.maps.DirectionsTravelMode.DRIVING
    };

    // send route solution request to API
    this.directionsService.route(request, function(result,status){
      if(status == _this.google.maps.DirectionsStatus.OK){
        // render route solution
        _this.directionsDisplay.setDirections(result);
        // cache result to view
        _this.routeResult = result;
        // get places
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
      // create request object
      var request = {
        location: _this.routeResult.routes[0].overview_path[index],
        radius: _this.formView.radius * 1609.34,
        types: [_this.formView.placeType],
        keyword: _this.formView.keyword,
        openNow: true
      };

      if(request.types === 'restaurant') request.minPriceLevel = 1;

      _this.service.nearbySearch(request, function(results,status){
        if (status === 'OVER_QUERY_LIMIT'){
          // gradually increase timeout
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

        // update progress bar
        _this.updateProgress(index);

        // loop, with delay if API limit reached
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
      // this is a dupliacte
    } else {
      // add to places array
      this.places.push(thisPlace);

      // pin marker to map
      this.makeMapMarker(thisPlace);

      // add a list item
      this.addListItem(thisPlace);
    }
  },

  addListItem: function(thisPlace){
    var rating = thisPlace.rating ? thisPlace.rating : 'no rating';
    var types = thisPlace.types.join(' ');

    var request = {
      placeId: thisPlace.place_id
    }

    this.$('#results-section ul')
      .append('<li class="results-item '+types+'" id ="' + thisPlace.place_id + '"><a>'+thisPlace.name+'<a/><p>'+rating+'</p><div class="details"></div></li>');
  },

  makeMapMarker: function(thisPlace){
    var _this = this;

    // create a map marker
    var pin = new this.google.maps.Marker({
      map: this.map,
      position: thisPlace.geometry.location
    });

    // set custom icon
    if( !!thisPlace.customIcon ){
      pin.setIcon(thisPlace.customIcon);
    }

    // add info box
    this.google.maps.event.addListener(pin,'click',function(){
      _this.infowindow.setContent('<p><a class="mapPin" href="#'+ thisPlace.place_id + '">' + thisPlace.name + '</a></p>');
      _this.infowindow.open(_this.map, pin);
    });
    this.markers.push(pin);
  },

  addDetails:function(e){
    //console.log(e.target.hash);
    var li = this.$(e.target.hash);
    console.log(this.places);
    var place = _.where(this.places, {'place_id': e.target.hash.substring(1)});
    console.log(place);
      var details = '' + place[0].vicinity;
      li.find('.details').html(details);
  
  },

  updateProgress: function(index){
    var percentProgress =   (index / this.routeResult.routes[0].overview_path.length) * 100;
    this.$('#progress-bar').css('width', percentProgress + '%');
  },

  goBackToTop: function(){
    window.scrollTo(0,0);
  },

  setAllMap: function(map) {
     for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(map);
  }
  },

  deleteMarkers: function() {
    this.setAllMap(null);
    this.markers = [];
  }  

});

module.exports = MapView;
