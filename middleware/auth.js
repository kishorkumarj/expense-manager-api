var jwt = require('express-jwt');
const { JWT_SECRET } = require('../config/config');

/*
const revokedCallback = (req, payload, done) => {
  return False
}
*/
exports.auth = jwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  //isRevoked: revokedCallback
});