var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'memoji'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/memoji-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'memoji'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/memoji-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'memoji'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/memoji-production'
  }
};

module.exports = config[env];
