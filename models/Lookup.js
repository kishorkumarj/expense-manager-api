const mongoose = require("mongoose");

const lookupSchema = mongoose.Schema({
  name: {type: String, required: true},
  lookup_list: {
    type: [{
      name: {type: String, require: true},
      value: {type: String, require: true},
      active: {type: Boolean, required: true, default: true}
    }],
    default: []
  },
  active: {type: Boolean, require: true, default: true}
})

module.exports = mongoose.model('Lookup', lookupSchema);