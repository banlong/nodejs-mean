/*
* ROUTES DEFINITION FOR API
* */
var express = require('express'),
    router = express.Router(),
    ctrlLocations = require('../controllers/locations'),
    ctrlReviews = require('../controllers/reviews');

module.exports = function (app) {
  app.use('/api', router);
};
// Note that we don’t specify /api at the front of the path. We specify in app.js that these
// routes should only be used if the path starts with /api, so it’s assumed that all routes
// specified in this file will be prefixed with /api.

// create location
router.post('/locations', ctrlLocations.locationsCreate);

// get location by id
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);

// update location
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne);

// delete location
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);

// get location by coordinate
router.get('/locations', ctrlLocations.locationsListByDistance);

// add a review
router.post('/locations/:locationid/reviews', ctrlReviews.reviewsCreate);
// get a review
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
// update a review
router.put('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsUpdateOne);
// delete a review
router.delete('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsDeleteOne);


