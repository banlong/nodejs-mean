var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

    //Change the env will change the export configuration.
    // However, changing env value here are not encouraged. We should
    //set up env at OS level, i.e. set value for  NODE_ENV from OS admin
    //env = 'production';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'mean'
    },
    port: process.env.PORT || 3000,
    //db: 'mongodb://localhost/Loc8r-dev'
    db: 'mongodb://banlong:Sunghiep01@ds127341.mlab.com:27341/heroku_8vjlzglq'
  },

  test: {
    root: rootPath,
    app: {
      name: 'mean'
    },
    port: process.env.PORT || 3000,
    //db: 'mongodb://localhost/Loc8r-test'
    db: 'mongodb://banlong:Sunghiep01@ds127341.mlab.com:27341/heroku_8vjlzglq'
  },

  production: {
    root: rootPath,
    app: {
      name: 'mean'
    },
    port: process.env.PORT || 3000,
    //db: 'mongodb://localhost/Loc8r-prod'
    db: 'mongodb://banlong.com:Sunghiep01@ds127341.mlab.com:27341/heroku_8vjlzglq'
  }
};

//Export one configuration base on the env value (default is 'development'
module.exports = config[env];
