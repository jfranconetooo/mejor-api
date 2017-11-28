var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var cors = require('cors')

var cookieParser = require('cookie-parser');

var index = require('./routes/index');
var user = require('./routes/user');
var auth = require('./routes/auth');
var consulting = require('./routes/consulting');

var mongoose = require('mongoose');

var app = express();

var WEBAPP_URI = require('./app-settings').WEBAPP_URI;

//connect to mongo
require('./db/config').connect(mongoose);
require('./utils/schedules').init();

var corsOptions = {
  origin: [WEBAPP_URI],
  exposedHeaders: ['msg', 'error-msg'],
  credentials: true
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', index);
app.use('/auth', auth);
app.use('/user', user);
app.use('/consulting', consulting);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;