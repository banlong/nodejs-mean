var mongoose = require('mongoose'),
  config = require('../../config/config'),
  request = require('request');
  Location = mongoose.model('Location');


/* GET 'home' page */
module.exports.homelist = function(req, res){
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url: config.apiServer + path,
    method: "GET",
    json: {},
    qs: {
      lng: -122.3051316,
      lat: 47.5599647,
      maxDistance: 20
    }
  };

  //send request to Rest API
  request(
    requestOptions,
    function (err, response, body) {

      renderHomepage(req, res, body);
    }
  );
};

/* GET 'Location info' page */
module.exports.locationInfo = function(req, res){
  getLocationInfo(req, res, function (req, res, responseData) {
    renderDetailPage(req, res, responseData);
  })

};

/* GET 'Add review' page */
module.exports.addReview = function(req, res){
  getLocationInfo(req, res, function (req, res, responseData) {
    renderReviewForm(req, res, responseData);
  })

};

/* POST 'Add review' page */
module.exports.doAddReview = function(req, res){

  var requestOptions, path, locationid, postdata;
  locationid = req.params.locationid;
  console.log(locationid);
  path = "/api/locations/" + locationid + '/reviews';
  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };

  requestOptions = {
    url : config.apiServer + path,
    method : "POST",
    json : postdata
  };
  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode === 201) {
        res.redirect('/location/' + locationid);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

function renderReviewForm(req, res, responseData) {
  console.log(req.params.locationid);
  console.log(responseData);
  res.render('location-review-form', {
    title: "Review " + responseData.name + " on Loc8r",
    pageHeader: {
      title: "Review " + responseData.name
    }
  });
}

var getLocationInfo = function (req, res, callback) {
  var requestOptions, path;
  path = "/api/locations/" + req.params.locationid;
  requestOptions = {
    url : config.apiServer + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 200) {
        data.coords = {
          lng : body.coords[0],
          lat : body.coords[1]
        };
        callback(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

function renderHomepage(req, res, responseBody) {
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No places found nearby";
    }
  }
  var locations = convertMultipleRatings(responseBody);
  //console.log(locations);
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about.Perhaps with coffee, " +
    "cake or a  pint ? Let Loc8r help you find the place you're looking for.",
    locations: locations,
    message: message
  });
}

function renderDetailPage(req, res, locDetail) {
    locDetail.rating = convertRating(locDetail.rating);
    locDetail.reviews = convertMultipleRatings(locDetail.reviews);
    locDetail.reviews = formatDates(locDetail.reviews);
    console.log(locDetail);
    res.render('location-info', {
      title: locDetail.name,
      pageHeader: {title: locDetail.name},
      sidebar: {
        context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
        callToAction: 'If you\'ve been and you like it - or if you don\'t please leave a review to help other people just like you.'
      },
    location: locDetail
    });
}

// Create a rating array with 1 is full, 0 is empty
function convertMultipleRatings(data) {
  for (var i = 0; i < data.length; i++){
    var rate = data[i].rating;
    var rateVal = [false,false,false,false,false];
    for (var j = 0; j < rate; j++){
      rateVal[j] = true;
    }
    data[i].rating = rateVal;
  }
  return data;
}

function formatDates(data) {
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  for (var i = 0; i < data.length; i++){
    var dateVal  = new Date(data[i].createdOn);
    var day = dateVal.getDate();
    var month = dateVal.getMonth();
    var monthStr = months[month];
    var year = dateVal.getFullYear();
    var formattedDate = day + " " + monthStr + " " + year;
    data[i].createdOn = formattedDate;
  }
  return data;
}

function convertRating(rate) {
  var rateVal = [false,false,false,false,false];
  if (rate <= 0) return rateVal;
  for (var j = 0; j < rate; j++){
    rateVal[j] = true;
  }
  return rateVal;

}
