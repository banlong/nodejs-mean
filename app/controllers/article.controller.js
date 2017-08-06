/**
 * Created by NGHIEP on 8/6/2017.
 */
var mongoose = require('mongoose'),
  Article = mongoose.model('Article');

/* CONTROLLER GET home page */
module.exports.getArticle = function(req, res, next){
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('article', {
      title: 'Create Article'
    });
  });
};


module.exports.postArticle = function(req, res, next){
  var url = req.body.url;
  var title = req.body.title;
  var content = req.body.content;
  var article = new Article({
    title: title,
    url: url,
    content: content
  });
  article.save();

  res.redirect('/');
  // Article.find(function (err, articles) {
  //   if (err) return next(err);
  //   res.render('articlelist', {
  //     title: 'Generator-Express MVC - After saved',
  //     articles: articles
  //   });
  // });
};
