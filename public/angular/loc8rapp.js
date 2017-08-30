
(function () {
  var app = angular.module('loc8rApp', []);

  //change default interpolate symbol of AngularJs From {{}} to {[{}]} to avoid conflict
  //to the default one of NodeJS
  app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
  });


  app.controller('locationListCtrl', function ($scope) {
    $scope.data = {
      locations: [{
        name: 'Burger Queen',
        address: '125 High Street, Reading, RG6 1PS',
        rating: convertRating(3),
        facilities: ['Hot drinks', 'Food', 'Premium wifi'],
        distance: '0.3',
        _id: '5370a35f2536f6785f8dfb6a'
      },{
        name: 'Costy',
        address: '125 High Street, Reading, RG6 1PS',
        rating: convertRating(5),
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
})();



