const fs = require('fs');
var path = require('path');
const LookupModal = require('../models/Lookup');

// Lookup will be created initially, it will not be updated/added again.
// API will be provided to edit/add lookup later.

const loadAppLookups = async () => {
  fs.readFile(path.join(baseDir, 'config', 'lookups.json'), (err, data) => {
    if (err){
      console.log('Error reading json file.', err)
    }
    let lookup = JSON.parse(data);
    Object.keys(lookup).forEach(item => {
      LookupModal.findOne({
        name: item
      }).then(lookupDoc => {
        if (lookupDoc){
          console.log(`lookup ${item} already exist in db.`)
          return false;
        }

        let obj = new LookupModal({
          name: item,
          lookup_list: lookup[item]
        })

        obj.save(error => {
          if (error){
            console.log(`Failed to add lookup ${item} to db. error ${error}`)
          }
        })
      }).catch(err => console.log(err))
    })
  });
}

module.exports = {
  loadAppLookups
}