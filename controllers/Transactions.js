const { body, validationResult } = require("express-validator");
const { ObjectId } = require('mongodb');

const UserModal = require('../models/User');
const AccountModal =  require('../models/Accounts');
const apiResponse = require('../helpers/apiResponse');
const { auth } = require('../middleware/auth')
const permission = require('../middleware/permission');

exports.ListTransactions = [
  auth,
  function(req, res){
    params = {}
    tasnaction_params = {}

    if (req.query.account_id){
      if(!ObjectId.isValid(req.query.account_id)){
        return apiResponse.badResponse(res, 'invalid account id')
      }

      params['_id'] = ObjectId(req.query.account_id)
    }

    const transaction_type = req.query.transaction_type;
    if (transaction_type === 'debit'){
      tasnaction_params['transactions.expense'] = true;
    }else if (transaction_type === 'credit'){
      tasnaction_params['transactions.expense'] = false
    }

    if (req.query.category){
      tasnaction_params['transactions.category'] = req.query.category;
    }

    tasnaction_params['transactions.date'] = {
      '$gte': new Date(2022, 03, 01),
      //'$lt': new Date(2022, 03, 31)
    }

    AccountModal.aggregate([
      {
        $match: {
          user_id: ObjectId(req.user.userId),
         ...params
        }
      },
      {$unwind: "$transactions"},
      { $match: {
          ...tasnaction_params
        }
      }
    ]).then(accounts => {
      const transactionList = [];
      accounts.forEach(account => {
        transactionList.push(account.transactions)
      })
    
      return apiResponse.jsonResponse(res, transactionList, 200)
    }).catch(err => {
      console.log('Failed to get transactions. error: ', err)
      return apiResponse.errorResponse(res, 'Internal server error')
    })
  }
]

exports.CreateTransactionAPI = [
  auth,

  body('name')
  .isLength({min: 1})
  .trim()
  .withMessage('Please enter transaction text.')
  .escape(),

  body('date')
  .isDate()
  .withMessage('Please enter transaction date.')
  .escape(),

  body('category')
  .isLength({min: 1})
  .withMessage('Please enter category')
  .escape(),

  body('amount')
  .isNumeric(0)
  .withMessage('Amount is required')
  .escape(),

  body('expense')
  .isBoolean()
  .withMessage('Specify whether transaction is expense or not.')
  .escape(),

  body('account_id')
  .isLength({min: 1})
  .withMessage('Please enter account details.')
  .escape(),

  async function(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.jsonResponse(res, {
        message: 'Validation error',
        ...errors
      }, 400)
    }

    // check user has an account.
    if(!ObjectId.isValid(req.body.account_id)){
      return apiResponse.badResponse(res, 'invalid account id')
    }

    const account = await AccountModal.findOne({
      user_id: req.user.userId,
      _id: req.body.account_id
    }).catch(err => {
      console.log('Error getting account: ', err)
      return null
    })

    if (!account){
      return apiResponse.badResponse(res, 'Couldnt find an account with given id.')
    }

    transaction = {
      name: req.body.name,
      date: req.body.date,
      amount: req.body.amount,
      category: req.body.category,
      expense: req.body.expense,
      account_id: account._id,
      date_added: new Date()
    }
    
    //console.log('adding new transaction: ', transaction)

    try{
      account.transactions.push(transaction)
      const data = await account.save((error, result) => {
        if (error){
          console.log('Failed to save transaction. error', error)
          return apiResponse.errorResponse(res)
        }

        apiResponse.jsonResponse(res, result.transactions.pop(), 201)

      })
    }catch(err){
      console.log('error: ', err)
      return apiResponse.errorResponse(res)
    }
  }
]

exports.TransactionDetail = [
  auth,
  async function(req, res){
    const transactionId = req?.params?.transactionId;
    AccountModal.findOne(
      { user_id: req.user.userId },
      {
        transactions: {
          $elemMatch:{
            _id: transactionId
          }
        }
      }).then(account => {
      if (account){
        transaction = account?.transactions?.[0];
        return apiResponse.jsonResponse(res, transaction || {}, 200)
      }else{
        return apiResponse.notFoundResponse(res)
      }
    }).catch(err => {
      console.log(err);
      return apiResponse.errorResponse(res)
    })
  }
]

exports.UpdateTransaction = [
  auth,

  body('name')
  .optional()
  .isLength({min: 1})
  .trim()
  .withMessage('Please enter transaction text.'),

  body('date')
  .optional()
  .isDate()
  .withMessage('Please enter transaction date.')
  .escape(),

  body('category')
  .optional()
  .isLength({min: 1})
  .withMessage('Please enter category'),

  body('amount')
  .optional()
  .isNumeric(0)
  .withMessage('Amount is required')
  .escape(),

  body('expense')
  .optional()
  .isBoolean()
  .withMessage('Specify whether transaction is expense or not.')
  .escape(),

  function(req, res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.jsonResponse(res, {
        message: 'Validation error',
        ...errors
      }, 400)
    }

    const transactionId = req?.params?.transactionId;
    AccountModal.findOne(
      { user_id: req.user.userId },
      {
        transactions: {
          $elemMatch:{
            _id: transactionId
          }
        }
      }
    ).then(account => {

      transaction = account?.transactions?.[0];
      if (!transaction){
        return apiResponse.notFoundResponse(res);
      }

      let fields = ['amount', 'name', 'date', 'category', 'expense']
      fields.forEach(field => {
        
        if (field in req.body){
          let data = req.body?.[field];
          if (field === 'amount'){
            data = parseInt(data)
          }else if (field === 'expense'){
            console.log(data, typeof(data))
            data = (data === 'true');
            console.log('data after:: ', data, typeof(data))
          }

          transaction[field] = data;
        }
      })
  
      account.save((error, result) =>{
        if (error){
          console.log('Failed to update transaction. error', error)
          return apiResponse.errorResponse(res)
        }

        apiResponse.jsonResponse(res, transaction, 200)
      })

    }).catch(err => {
      console.log(err);
      return apiResponse.errorResponse(res)
    })
  }
]

exports.DeleteTransaction = [
  auth,
  function(req, res){
    const transactionId = req?.params?.transactionId;
    AccountModal.updateOne(
      { user_id: req.user.userId },
      {
        $pull: {
          transactions: {
            _id:  ObjectId(transactionId)
          }
        }
      }
    ).then(account => {
      if (!account.modifiedCount){
        return apiResponse.notFoundResponse(res);
      }
      return apiResponse.jsonResponse(res, {message: 'success'}, 202)
    }).catch(err => {
      console.log(err)
      return apiResponse.errorResponse(res)
    })
  }
]