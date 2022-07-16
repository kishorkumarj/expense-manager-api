//var dotenv = require('dotenv');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose')
//dotenv.config()

var config = require('./config/config');
var indexRouter = require('./routes/index');
var mainRouter = require('./routes/main');
var { loadAppLookups } = require('./utils/initLookup');
var { appLogger, stringify } = require('./utils/logger');

global.baseDir = __dirname;

mongoose.connect(config.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('connected to Mongo db: ', config.MONGO_DB_URL);
  // load lookups to database.
  loadAppLookups()
})
.catch((err) => {
  console.log(`Failed to connect to mongodb: ${config.MONGO_DB_URL}: error: `, err)
  process.exit(0)
})

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (config.LOG_LEVEL === 'debug'){
  app.use(logger('DEBUG: :date[clf] :method :url :status :total-time ms - :res[content-length]'));
}

app.use(cors({
  credentials: true,
  origin: true,
}));

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
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message: 'Unauthorized. Invalid token!!'});
  }else{
    res.status(err.status || 500);
    let errMsg = 'Internal server errorr';
    appLogger.error(`${stringify(errMsg)} %o`, err.message)
    res.json({message: errMsg});
  }
});

module.exports = app;
