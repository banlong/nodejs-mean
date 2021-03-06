var mongoose = require('mongoose'),
  Location = mongoose.model('Location');
  mongoose.Promise = global.Promise;

//Get one location by Id
module.exports.locationsReadOne = function (req, res) {
  if (req.params && req.params.locationid) {
    var id = req.params.locationid;
    Location.findById(id, function(err, location) {
        if (!location) {
          sendJsonResponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }
        sendJsonResponse(res, 200, location);
    });
  } else {
    sendJsonResponse(res, 404, {"message": "No locationid in request"
    });
  }
};

//Get 10 nearest locations within 20 km radius
module.exports.locationsListByDistance = function(req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);

  if (!lng || !lat) {
    sendJsonResponse(res, 404, {
      "message": "lng and lat query parameters are required"
    });
    return;
  }

  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };

  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(maxDistance),
    num: 10
  };

  Location.geoNear(point, geoOptions, function (err, results, stats) {

    var locations = [];
    results.forEach(function(doc) {
      locations.push({
        distance: theEarth.getDistanceFromRads(doc.dis),
        name: doc.obj.name,
        address: doc.obj.address,
        rating: doc.obj.rating,
        facilities: doc.obj.facilities,
        _id: doc.obj._id
      });
    });
    sendJsonResponse(res, 200, locations);
  });
};

//Create a location
module.exports.locationsCreate = function (req, res) {
  var loc = req.body;
  Location.create({
    name: loc.name,
    address: loc.address,
    facilities: loc.facilities.split(","),
    coords: [parseFloat(loc.lng), parseFloat(loc.lat)],
    openingTimes: [{
      days: loc.days1,
      opening: loc.opening1,
      closing: loc.closing1,
      closed: loc.closed1
    }, {
      days: loc.days2,
      opening: loc.opening2,
      closing: loc.closing2,
      closed: loc.closed2
    }]
  }, function(err, location) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, location);
    }
  });
};

//Update a location
module.exports.locationsUpdateOne = function (req, res) {
  if (!req.params.locationid) {
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid is required"
    });
    return;
  }
  Location.findById(req.params.locationid)
    .select('-reviews -rating')             //exclude the reviews & rating from return value
    .exec( function (err, location) {
      if (!location) {
        sendJsonResponse(res, 404, {
          "message": "locationid not found"
        });
        return;
      } else if (err) {
        sendJsonResponse(res, 400, err);
        return;
      }

      var inputLocation = req.body;
      location.name =    inputLocation.name;
      location.address =  inputLocation.address;
      location.facilities = inputLocation.facilities.split(",");
      location.coords = [parseFloat(inputLocation.lng), parseFloat(inputLocation.lat)];
      location.openingTimes = [{
        days:     inputLocation.days1,
        opening:  inputLocation.opening1,
        closing:  inputLocation.closing1,
        closed:   inputLocation.closed1
      }, {
        days:     inputLocation.days2,
        opening:  inputLocation.opening2,
        closing:  inputLocation.closing2,
        closed:   inputLocation.closed2
      }];
      location.save(function (err, location) {
        if (err) {
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res, 200, location);
        }
      });
    }
  );
};

//Delete a location
module.exports.locationsDeleteOne = function (req, res) {
  var locationid = req.params.locationid;
  if (locationid) {
    Location
      .findByIdAndRemove(locationid)
      .exec(
        function (err, location) {
          if (err) {
            sendJsonResponse(res, 404, err);
            return;
          }
          sendJsonResponse(res, 204, null);
        }
      );
  } else {
    sendJsonResponse(res, 404, {
      "message": "No locationid"
    });
  }
};


var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

// distance calculation
var theEarth = (function(){
  var earthRadius = 6371; // km, miles is 3959
  var getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  };
  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  };
  return {
    getDistanceFromRads : getDistanceFromRads,
    getRadsFromDistance : getRadsFromDistance
  };
})();

