
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

  app.controller('locationListCtrl', function ($scope, loc8rData, geolocation) {
    $scope.data = {};

    //Here I must use $scope here because the function that attach to scope will be available when put in as
    // a callback function. If a function is not defined with scope, an exception of not "loc8rData" is not defined
    $scope.getData = function(position) {
      var lat = position.coords.latitude,
          lng = position.coords.longitude;
      $scope.message = "Searching for nearby places";
      var locInfo = {
        lng: lng,
        lat: lat,
        maxDistance: 20
      };

      var promise = loc8rData.locationByCoords(locInfo);
      promise.then(function (result) {
        var locations = result.data;
        $scope.data.locations = locations;
        //console.log("location found: ",locations);
        if(locations.length == 0){
          $scope.data.message = "No location found";
        }
      }, function (result) {
          $scope.data.message = result.data.message;
          console.log("Err: ",result);
      });
    };

    $scope.showError = function (error) {
      $scope.$apply(function() {
        $scope.message = error.message;
      });
    };

    geolocation.getPosition($scope.getData,$scope.showError);

  });


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
        return "5m";
      }
    };
  }

})();
