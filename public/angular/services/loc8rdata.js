'use strict';
angular.module('loc8rApp')
  .service('loc8rData', function ($http, geolocation) {

    return {
      locationByCoords: locationByCoords
    };

    function locationByCoords(locInfo) {
      return $http({
        url: '/api/locations',
        method: "GET",
        params: locInfo
      });
    }
  });
