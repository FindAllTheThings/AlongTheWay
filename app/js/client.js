var map = require('./map');
var route = require('./route');
var places = require('./places');
var $ = require('jquery');


$(function(){
  map.init();
  
  route.test();



    // bind handle
    $('#overlay-handle').on('click',function(){
      $('#options-wrapper').toggleClass('open');
    });

    // close overlay on execute
    $('#go').on('click', function(){
      $('#options-wrapper').toggleClass('open');
    });

});
