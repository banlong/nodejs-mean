/**
 * Created by nghie on 9/7/2017.
 */
angular.module('loc8rApp')
  .service('geolocation', function () {
    return {
      getPosition: getPosition
    };

    var options = {
      enableHighAccuracy: true
    };

    function getPosition(cbSuccess, cbError) {
      return navigator.geolocation.getCurrentPosition(cbSuccess, cbError, options);
    }

  });
