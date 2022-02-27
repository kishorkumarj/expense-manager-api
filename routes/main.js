var express = require('express')
var router = express.Router()
const BaseController = require('../controllers/BaseController');
const AuthController = require('../controllers/AuthController');

router.get('/home', BaseController.HomePage);
router.get('/auth/register', AuthController.register);
router.get('/auth/login', AuthController.login);
router.get('/auth/logout', AuthController.logout);

module.exports = router