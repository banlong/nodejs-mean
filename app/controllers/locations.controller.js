var mongoose = require('mongoose'),
  Location = mongoose.model('Location');


/* GET 'home' page */
module.exports.homelist = function(req, res){
  res.render('locationlist', { title: 'Home', strapline: 'Find places to work with wifi near you!', locations:[
  {
    name: 'Starcups',
    address: '125 High Street, Reading, RG6 1PS',
    rating: rating(3),
    facilities: ['Hot drinks', 'Food', 'Premium wifi'],
    distance: '100m'
  },{
    name: 'Cafe Hero',
    address: '30 Broadway, Seattle, WA 98003',
    rating: rating(4),
    facilities: ['Hot drinks', 'Food', 'Premium wifi'],
    distance: '200m'
  },{
    name: 'Burger Queen',
    address: '67 S Jackson st, Seattle, WA 98320',
    rating: rating(2),
    facilities: ['Food', 'Premium wifi'],
    distance: '250m'
  }]});
};

/* GET 'Location info' page */
module.exports.locationInfo = function(req, res){
  res.render('location-info', {
    title: 'Starcups',
    pageHeader: {
      title: 'Starcups'
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: {
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: rating(3),
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      coords: {
        lat: 51.455041,
        lng: -0.9690884
      },
      openingTimes: [{
        days: 'Monday - Friday',
        opening: '7:00am',
        closing: '7:00pm',
        closed: false
      }, {
        days: 'Saturday',
        opening: '8:00am',
        closing: '5:00pm',
        closed: false
      }, {
        days: 'Sunday',
        closed: true
      }],
      reviews: [{
        author: 'Simon Holmes',
        rating: rating(5),
        timestamp: '16 July 2013',
        reviewText: 'What a great place. I can\'t say enough good things about it.'
      }, {
        author: 'Charlie Chaplin',
        rating: rating(3),
        timestamp: '16 June 2013',
        reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
      }]
    }
  });
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
function rating(rate) {
  var rateVal = [false,false,false,false,false];
  for (var i = 0; i < rate; i++){
    rateVal[i] = true;
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
