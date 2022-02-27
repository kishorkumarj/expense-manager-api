const path = require('path');
const fs = require('fs')
const apiResponse = require('../helpers/apiResponse');
const { appLogger } = require ('../utils/logger');
const { auth } = require('../middleware/auth');

exports.HomePage = [
  function (req, res){
    return apiResponse.successResponse(res, 'Welcome to express server home page.')
  }
]

exports.UserDetail = [
  auth,
  function(req, res){
    return apiResponse.successResponse(res, 'Welcome user.')
  }
]