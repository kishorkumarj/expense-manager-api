const { body, validationResult } = require("express-validator");

const UserModal = require('../models/User');
const AccountModal = require('../models/Accounts');
const apiResponse = require('../helpers/apiResponse');
const { auth } = require('../middleware/auth')
const permission = require('../middleware/permission');
const { appLogger, stringify } = require('../utils/logger');

exports.addAccount = [
  auth,

  body('accountName')
  .isLength({min: 1})
  .trim()
  .withMessage('Account Name is required.')
  .escape(),

  body('balance')
  .isLength({min: 0})
  .isNumeric()
  .withMessage('Balance should be number')
  .escape(),

  body('accountType')
  .isLength({min: 1})
  .withMessage('Account type is required')
  .escape(),

  async function(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.jsonResponse(res, {
        message: 'Validation error',
        ...errors
      }, 400)
    }

    const account = await AccountModal.findOne({
        user_id: req.user.userId,
        account_name: req.body.accountName
    }).catch(err => null);

    if (account){
      appLogger.info('create account: Account with name already exist')
      return apiResponse.badResponse(res, 'Account with this name already exist.')
    }else{
      appLogger.silly('Creating new account.')
      const account = new AccountModal({
        account_name: req.body.accountName,
        account_type: req.body.accountType,
        balance: req.body.balance,
        user_id: req.user.userId
      })

      account.save(err => {
        if(err){
          appLogger.error('Failed to create account. %o', err)
          return apiResponse.errorResponse(res, 'Failed to create account.')
        }

        const accountData = {
          id: account._id,
          account_name: account.account_name,
          account_type: account.account_type,
          balance: account.balance
        }

        return apiResponse.jsonResponse(res, accountData, 201)
      })
    }
  }
]

exports.ListAllAccount=[
  auth,
  function (req, res){
    AccountModal.find({
      user_id: req.user.userId,
   }).then( accounts => {
      const accountDetails = accounts.map(account => {
        return {
          id: account._id,
          account_name: account.account_name,
          account_type: account.account_type,
          card_number: account.card_number,
          account_number: account.account_number,
          balance: account.balance,
        }
      })
      return apiResponse.jsonResponse(res, accountDetails, 200)
   }).catch(err => {
     return apiResponse.errorResponse(res, 'Failed to load user account details.')
   });
  }
]

exports.ListDeleteAccountAPI=[
  auth,
  permission.accountPermission,
  async function(req, res){
    const accountId = req?.params?.account;

    if (!accountId){
      return apiResponse.badResponse(res, 'missing account id.')
    }

    if(req.method === 'GET'){
      const account = await AccountModal.findOne({
        user_id: req?.user?.userId,
        _id: accountId
      }).select({
        'transactions': 0
      }).catch(err => null);
    
      if (!account){
        return apiResponse.notFoundResponse(res, 'Not found.')
      }

      return apiResponse.jsonResponse(res, {
        id: account._id,
        account_name: account.account_name,
        account_type: account.account_type,
        card_number: account.card_number,
        account_number: account.account_number,
        balance: account.balance,
      })
    }

    if (req.method === 'DELETE'){
      const status = await AccountModal.deleteOne({
        user_id: req.user.userId,
        _id: accountId
      }).catch(err => null);

      if (status){
        return res.status(204).json({'message': 'success'})
      }else{
        return apiResponse.errorResponse(res, 'Failed to delete account.')
      }
    }
    
  }
]

exports.UpdateAccountAPI = [
  auth,
  permission.accountPermission,
  body('accountName')
  .isLength({min: 1})
  .trim()
  .withMessage('Account Name is required.')
  .escape(),

  body('balance')
  .isLength({min: 0})
  .isNumeric()
  .withMessage('Balance should be number.')
  .escape(),

  body('active')
  .isLength({min: 0})
  .isNumeric()
  .withMessage('Please input true or false.')
  .escape(),

  async function(req, res){
    const accountId = req?.params?.account;
    const account = await AccountModal.findOne({
      user_id: req?.user?.userId,
      _id: accountId
    }).catch(err => null);

    if (!account){
      return apiResponse.notFoundResponse(res, 'Not Found.')
    }

    ['account_name', 'card_number', 'account_number', 'balance', 'active'].forEach(field => {
      if (req.body[field]){
        account[field] = req.body[field]
      }
    })

    account.save(function(err){
      if (err){
        appLogger.log('error updating account details. %o', err)
        return apiResponse.errorResponse(res, 'Failed to update account')
      }

      return apiResponse.jsonResponse(res,{
        id: account._id,
        account_name: account.account_name,
        account_type: account.account_type,
        card_number: account.card_number,
        account_number: account.account_number,
        balance: account.balance,
      }, 200)
    })
    
  }
]