var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var mainRouter = require('./routes/main');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger(':date[clf] :method :url :status :total-time ms - :res[content-length]'));
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/api/v1/', mainRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.all('*', function(req, res, next) {
  return res.status(404).json({'message': "Page not found"})
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  let errMsg = 'Internal server errorr';
  console.log(`${errMsg}: `, err.message);
  res.json({message: errMsg});
});

module.exports = app;
