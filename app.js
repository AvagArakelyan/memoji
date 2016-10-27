

var config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

var fs = require('fs');
var path = require('path');
var express = require('express');
var https = require('https');
var http = require('http');
var app = express();

var privateKey  = fs.readFileSync(path.resolve(__dirname, 'config/sslcert/2426295-memoji.key'), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname, 'config/sslcert/2426295-memoji.cert'), 'utf8');

app.listen = function() {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};

require('./config/express')(app, config);

http.createServer(app).listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});
https.createServer({ key: privateKey, cert: certificate}, app).listen(3443);


