const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_TOKEN_EXPIRY } = require('../config/config');

const JWTData = {
  expiresIn: JWT_TOKEN_EXPIRY,
  //noTimestamp: true
}

const generateJWTToken = payload => jwt.sign(payload, JWT_SECRET, JWTData);

exports.generateJWTToken = generateJWTToken;

exports.getStartEndMonth = (date) => {
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1, '00', '00', '00');
  let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, '23', '59', '59');

  return [firstDay, lastDay]
}