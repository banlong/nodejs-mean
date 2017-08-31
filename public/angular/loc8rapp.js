
(function () {
  var app = angular.module('loc8rApp', []);

  //change default interpolate symbol of AngularJs From {{}} to {[{}]} to avoid conflict
  //to the default one of NodeJS
  app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
  });

  //Add custom filter
  app.filter('formatDistance', formatDistance);

  //Location component
  app.component("locationBar", {
    templateUrl:'/angular/templates/location.html',
    bindings:{
      location: '='    //this is location inf
    },
    controllerAs: "model",
    controller: function () {
      var model;
      this.$onInit = function() {
        model = this.location;

        var rateVal = [false,false,false,false,false];
        for (var j = 0; j < model.rating; j++){
            rateVal[j] = true;
        }
        model.rating = rateVal;
      };
    }
  });

  app.controller('locationListCtrl', function ($scope) {
    $scope.data = {
      locations: [{
        name: 'Burger Queen',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 3,
        facilities: ['Hot drinks', 'Food', 'Premium wifi'],
        distance: '0.3',
        _id: '5370a35f2536f6785f8dfb6a'
      },{
        name: 'Costy',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 5,
        facilities: ['Hot drinks', 'Food', 'Alcoholic drinks'],
        distance: '0.8',
        _id: '5370a35f2536f6785f8dfb6a'
      }]
    };
  });

  function convertRating(rate) {
    var rateVal = [false,false,false,false,false];
    if (rate <= 0) return rateVal;
    for (var j = 0; j < rate; j++){
      rateVal[j] = true;
    }
    return rateVal;
  }

  function _isNumeric (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

 function formatDistance() {
    return function (distance) {
      var numDistance, unit;
      if (distance && _isNumeric(distance)) {
        if (distance > 1) {
          numDistance = parseFloat(distance).toFixed(1);
          unit = 'km';
        } else {
          numDistance = parseInt(distance * 1000,10);
          unit = 'm';
        }
        return numDistance + unit;
      } else {
        return "?";
      }
    };
  }
})();



