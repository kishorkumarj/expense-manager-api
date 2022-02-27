const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_TOKEN_EXPIRY } = require('../config/config');

const JWTData = {
  expiresIn: JWT_TOKEN_EXPIRY,
  //noTimestamp: true
}

const generateJWTToken = payload => jwt.sign(payload, JWT_SECRET, JWTData);

exports.generateJWTToken = generateJWTToken;