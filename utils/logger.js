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
    winston.format.prettyPrint(),
    winston.format.splat(),
    winston.format.printf(info => {
      if (typeof info.message === 'object') {
        info.message = JSON.stringify(info.message, null, 3)
      }

      return `${[info.timestamp]}: ${info.level.toUpperCase()}: ${info.message}`
    }),
  )
};

const logger = winston.createLogger(logConfiguration);

const stringify = (obj) => JSON.stringify(obj)

module.exports = {
  appLogger: logger,
  stringify: stringify
}

