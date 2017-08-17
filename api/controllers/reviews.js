var mongoose = require('mongoose'),
  Location = mongoose.model('Location');

// get a review by first access to its parent
module.exports.reviewsReadOne = function (req, res) {
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

      var review = location.reviews.id(req.params.reviewid);
      if (!review) {
        sendJsonResponse(res, 404, {
          "message": "reviewid not found"
        });
        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      sendJsonResponse(res, 200, review);
    });
  } else {
    sendJsonResponse(res, 404, {"message": "No locationid in request"
    });
  }

};

// create a review
module.exports.reviewsCreate = function (req, res) {
  var locationid = req.params.locationid;
  console.log("locationid:" , locationid);
  if (locationid) {
    Location.findById(locationid, function(err, location) {
          if (err) {
            sendJsonResponse(res, 400, err);
          } else {
            doAddReview(req, res, location);
          }
        }
      );
  } else {
    sendJsonResponse(res, 404, {
      "message": "Not found, locationid required"
    });
  }
};

module.exports.reviewsUpdateOne = function (req, res) {
  sendJsonResponse(res, 200, {"reviewsUpdateOne" : "success"});
};

module.exports.reviewsDeleteOne = function (req, res) {
  sendJsonResponse(res, 200, {"reviewsDeleteOne" : "success"});
};

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var doAddReview = function(req, res, location) {
  if (!location) {
    sendJsonResponse(res, 404, {
      "message": "locationid not found"
    });
  } else {
    var rv = req.body;
    console.log("Review:", rv);
    location.reviews.push({
      author: rv.author,
      rating: rv.rating,
      reviewText: rv.reviewText
    });
    location.save(function(err, location) {
      var thisReview;
      if (err) {
        sendJsonResponse(res, 400, err);
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        sendJsonResponse(res, 201, thisReview);
      }
    });
  }
};

var updateAverageRating = function(locationid) {
  Location.findById(locationid, function(err, location) {
        if (!err) {
          doSetAverageRating(location);
        }
      });
};

var doSetAverageRating = function(location) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};

