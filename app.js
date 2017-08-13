var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

//Options for DB connection
var options = {
  //db: { native_parser: true },
  //server: { poolSize: 5 },
  //replset: { rs_name: 'myReplicaSetName' },
  //user: 'myUserName',
  //pass: 'myPassword'
  useMongoClient: true
};
mongoose.connect(config.db, options);
//mongoose.connect(config.db);


var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

db.on('connected', function () {
  console.log('Mongoose connected to ' + config.db);
});

db.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

module.exports = require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

