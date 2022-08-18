'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var multer = require('multer');
var bodyParser = require('body-parser')

var app = module.exports = loopback();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true,limit: '3mb' }))
//app.use(loopback.bodyParser.urlencoded({limit: '1024mb', extended: true}));
 
// parse application/json
app.use(bodyParser.json({limit: '3mb'}))
app.use(multer().any());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
