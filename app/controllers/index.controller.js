 /**
 * Created by Nghiep on 8/6/2017.
 */
 var mongoose = require('mongoose'),
   Article = mongoose.model('Article');

/* CONTROLLER GET home page */
module.exports.getIndex = function(req, res, next){
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'Express MVC',
      articles: articles
    });
  });


  // res.render('index', {
  //   title: 'Express MVC'
  // });
};
