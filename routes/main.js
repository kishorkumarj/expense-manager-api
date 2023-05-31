var express = require('express')
var router = express.Router()
const BaseController = require('../controllers/BaseController');
const AuthController = require('../controllers/AuthController');
const AccountController = require('../controllers/AccountController');
const TransactionController = require('../controllers/Transactions');
const UserController = require('../controllers/UserController');

router.get('/home', BaseController.HomePage);
router.post('/auth/register', AuthController.register);
router.post('/auth/obtain-token', AuthController.login);
router.get('/auth/logout', AuthController.logout);

router.get('/user', UserController.UserDetail);
router.get('/user/categoty', UserController.GetCategory);

router.post('/user/account', AccountController.addAccount);
router.get('/user/account', AccountController.ListAllAccount);

router.get('/user/account/:account', AccountController.ListDeleteAccountAPI);
router.patch('/user/account/:account', AccountController.UpdateAccountAPI);
router.delete('/user/account/:account', AccountController.ListDeleteAccountAPI);

router.get('/user/transaction', TransactionController.ListTransactions);
router.post('/user/transaction', TransactionController.CreateTransactionAPI);

router.get('/user/transaction/:transactionId', TransactionController.TransactionDetail);
router.patch('/user/transaction/:transactionId', TransactionController.UpdateTransaction);
router.delete('/user/transaction/:transactionId', TransactionController.DeleteTransaction);

module.exports = router