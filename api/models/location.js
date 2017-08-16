var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OpeningTimeSchema = new Schema({
  days: {type: String, required: true},
  opening: String,
  closing: String,
  closed: {type: Boolean, required: true}
});

var ReviewSchema = new Schema({
  author: String,
  rating: {type: Number, required: true, min: 0, max: 5},
  reviewText: String,
  createdOn: {type: Date, "default": Date.now}
});

var LocationSchema = new Schema({
  name: {type: String, required:true},
  address: String,
  rating: {type: [Number], "default": 0, min:0, max: 5},
  facilities: [String],
  distance: String,
  coords: {type: [Number], index: '2dsphere'},
  openingTimes: [OpeningTimeSchema],
  reviews: [ReviewSchema]
});

LocationSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

module.exports = mongoose.model('Location', LocationSchema);


