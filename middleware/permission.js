const AccountModal = require('../models/Accounts');
const apiResponse = require('../helpers/apiResponse')

exports.accountPermission = async function(req, res, next){
  // check user has permmission to access the account, 
  // if not return permission denied.

  const account = await AccountModal.findOne({
    _id: req.params?.account
  }).catch(err => null);

  if (!account){
    return apiResponse.notFoundResponse(res, 'Not Found')
  }

  if(account.user_id.toString() !== req?.user?.userId){
    return apiResponse.unauthorizedResponse(res, 'Unauthorized')
  }
  next()
}