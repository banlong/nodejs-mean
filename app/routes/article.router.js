var express = require('express'),
  router = express.Router(),
  articleCtrl = require('../controllers/article.controller');


module.exports = function (app) {
  app.use('/article', router);
};

router.get('/', articleCtrl.getArticle);

//Get data from POST and save to database
router.post('/', articleCtrl.postArticle);
