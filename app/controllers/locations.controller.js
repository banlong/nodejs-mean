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

var renderHomepage = function (req, res, responseBody) {
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
};

/* GET 'Location info' page */
module.exports.locationInfo = function(req, res){
  var locationId = req.params.locationid;
  var requestOptions, path;
  path = '/api/locations/' + locationId;
  requestOptions = {
    url: config.apiServer + path,
    method: "GET",
    json: {}
  };

  //send request to Rest API
  request(
    requestOptions,
    function (err, response, body) {
      var data = body;
      data.coords = {
        lng : body.coords[0],
        lat : body.coords[1]
      };
      renderDetailPage(req, res, data);
    }
  );
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res){
  res.render('location-review-form', {
    title: 'Review Starcups on Loc8r',
    pageHeader: {
      title: 'Review Starcups'
    }
  });
};

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

function convertRating(rate) {
  var rateVal = [false,false,false,false,false];
  if (rate <= 0) return rateVal;
  for (var j = 0; j < rate; j++){
    rateVal[j] = true;
  }
  return rateVal;

}

module.exports.article = function(req, res, next){
  Location.find(function (err, locations) {
    if (err) return next(err);
    res.render('locationlist', {
      title: 'Create Article'
    });
  });
};

module.exports.postArticle = function(req, res, next) {
  var url = req.body.url;
  var title = req.body.title;
  var content = req.body.content;
  var location = new Location({});
  location.save();
};


function renderDetailPage(req, res, locDetail) {
    locDetail.rating = convertRating(locDetail.rating);
    locDetail.reviews = convertMultipleRatings(locDetail.reviews);
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
