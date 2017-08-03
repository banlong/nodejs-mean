var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });
});

router.get('/article', function (req, res, next) {
  res.render('article', {
    title: 'Article Admin'
  });
});

//Get data from POST and save to database
router.post('/article', function (req, res, next) {
  var url = req.body.url;
  var title = req.body.title;
  var content = req.body.content;
  var article = new Article({
    title: title,
    url: url,
    content: content
  });
  article.save();
  res.redirect('/articlelist')
});

router.get('/articlelist', function (req, res, next) {
  //this is to get all article
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('articlelist', {
      title: 'Articles List',
      articles: articles
    });
  });
});
