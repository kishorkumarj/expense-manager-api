var express = require('express')
var router = express.Router()
const BaseController = require('../controllers/BaseController');

router.get('/home', BaseController.HomePage);

module.exports = router