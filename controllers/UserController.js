const { auth } = require('../middleware/auth')
const LookupModel = require('../models/Lookup');
const UserModal = require('../models/User')
const apiResponse = require('../helpers/apiResponse');

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