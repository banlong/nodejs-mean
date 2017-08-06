// This is the definition of a schema called ArticleSchema, with an export name is Article
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  url: String,
  content: String
});

ArticleSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

module.exports = mongoose.model('Article', ArticleSchema);

