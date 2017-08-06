var express = require('express'),
    router = express.Router(),
    ctrlIndex = require('../controllers/index.controller');

module.exports = function (app) {
  app.use('/', router);
};

//Process Index page
router.get('/', ctrlIndex.getIndex);
