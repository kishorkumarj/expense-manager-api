const winston = require('winston');

/*
Suported log types:
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
*/

const logLevel = process.env.LOG_LEVEL || 'info';

const logConfiguration = {
  transports: [
    new winston.transports.Console({level: logLevel}),
  ],

  format: winston.format.combine(
      winston.format.timestamp({
         format: 'DD/MMM/YYYY HH:mm:ss'
     }),
      winston.format.printf(info => `${info.level.toUpperCase()}: ${[info.timestamp]}: ${info.message}`),
  )
};

const logger = winston.createLogger(logConfiguration);

module.exports = {
  appLogger: logger
}

