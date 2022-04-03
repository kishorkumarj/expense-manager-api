const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const UserModal = require('../models/User');
const apiResponse = require('../helpers/apiResponse');
const { generateJWTToken } = require('../utils/utils');
const { auth } = require('../middleware/auth')

exports.register = [
  body('firstName')
    .isLength({min: 1})
    .trim()
    .withMessage('First name is required.')
    .escape(),

  body('lastName')
    .isLength({min: 1})
    .trim()
    .withMessage('Last name is required.')
    .escape(),

  body('email')
    .trim()
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom((value) => {
      return UserModal.findOne({email: value}).then(user => {
        if(user){
          return Promise.reject("Email alredy exist in db.")
        }
      })
    }) 
    .escape(),
  
  body('password')
    .isLength({min: 5})
    .trim()
    .withMessage('password must be atleast 5 characters.')
    .escape(),

  function(req, res){
    
    // decode base64 password.
    //password = Buffer.from(req.body.password, 'base64').toString();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.jsonResponse(res, {
        message: 'Validation error',
        ...errors
      }, 400)
    }

    bcrypt.hash(req.body.password, 10, function (err, hash) {
      const user = new UserModal({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
      })

      user.save(err => {
        if (err){
          return apiResponse.errorResponse(res, err)
        }

        let userInfo = {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }

        userInfo.token = generateJWTToken(userInfo);

        userInfo.active = user.active
        userInfo.role = user.role
        return apiResponse.jsonResponse(res, userInfo, 201)
      })
    })
  }
]

exports.login = [
  body('username')
    .isLength({min: 1})
    .trim()
    .withMessage('Please enter username.')
    .escape(),
    
  body('password')
    .isLength({min: 1})
    .trim()
    .withMessage('Please enter password.')
    .escape(),

  function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.jsonResponse(res, {
        message: 'Validation error',
        ...errors
      }, 400)
    }

    const errMsg = 'Invalid username or password.';

    UserModal.findOne({email: req.body.username}).then(user => {
      if (!user){
        return apiResponse.badResponse(res, errMsg)
      }

      bcrypt.compare(req.body.password, user.password, function(err, same){
        if (!same){
          return apiResponse.badResponse(res, errMsg)
        }

        if (!user.active){
          return apiResponse.invalidResponse(res, 'Your account is not active.')
        }

        let userInfo = {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }

        userInfo.token = generateJWTToken(userInfo);

        userInfo.active = user.active
        userInfo.role = user.role
        return apiResponse.jsonResponse(res, userInfo)
      });
    })
  }
]

exports.logout = [
  auth,
  function(req, res){
    return apiResponse.successResponse(res, 'Logout success')
  }
]