/*
* ROUTES DEFINITION FOR WHOLE APPLICATION
* */
var express = require('express'),
    router = express.Router(),
    ctrlLocations = require('../controllers/locations.controller'),
    ctrlOthers = require('../controllers/others.controller');

module.exports = function (app) {
  app.use('/', router);
};

/* Locations pages */
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

/* Other pages */
router.get('/about', ctrlOthers.about);


