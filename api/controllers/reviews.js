var mongoose = require('mongoose'),
  Location = mongoose.model('Location');

module.exports.reviewsCreate = function (req, res) {
  sendJsonResponse(res, 200, {"reviewsCreate" : "success"});
};

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
