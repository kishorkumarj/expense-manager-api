const { auth } = require('../middleware/auth')
const LookupModel = require('../models/Lookup');
const UserModal = require('../models/User')
const apiResponse = require('../helpers/apiResponse');
const { appLogger } = require('../utils/logger')

exports.GetCategory = [
  auth,
  async function (req, res){

    const type = req.query.type;
    const user = await UserModal.findById(req.user.userId).catch(err => null)
    if (!user){
      return apiResponse.unauthorizedResponse(res)
    }

    let categories = [];
    let userList = [];
    let lookup = null
    if (type === 'spend'){
      lookup = await LookupModel.findOne({
        name: 'SPEND',
        active: true,
      }).sort({'lookup_list.name': 1}).catch(err=> null)
      
      userList = user.spendCategory.filter(item => item.active);
    }else if (type === 'credit'){
      lookup = await LookupModel.findOne({
        name: 'CREDIT',
        active: true
      }).sort({'lookup_list.name': 1}).catch(err=> null)

      userList = user.creditCategory.filter(item => item.active);
    }

    common_list = lookup.lookup_list.filter(item => item.active)
    categories = [...userList, ...common_list]

    categories.sort((a,b) => a.name > b.name ? 1 : -1 )
    return apiResponse.jsonResponse(res, categories, 200)
  }
]

exports.UserDetail = [
  auth,
  function(req, res){
    UserModal.findById(req.user.userId).then(user => {
      if(user){
        return apiResponse.jsonResponse(res, {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          active: user.active,
          role: user.role
        }, 200)
      }else{
        return apiResponse.notFoundResponse(res)
      }
    }).catch(err => {
      appLogger.error('Failed to load user details %o', err)
      return apiResponse.errorResponse(res)
    })
  }
]