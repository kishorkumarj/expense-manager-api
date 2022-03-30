const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {type: String, default: null, required: true},
  lastName:  {type: String, default: null, required: true},
  email:  {type: String, default: null, required: true},
  password: {type: String, default: null, required: true},
  phone:  {type: String, default: null},
  active:  {type: Boolean, default: true},
  dob:  {type: String, default: null, required: false},
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user',
    required: true
  },

  preferences: {
    type: {
      theme: {
        type: String,
        required: true,
        enum: ['light', 'dark'],
        default: 'light'
      },
      currancy: {
        type: String,
        required: true,
        enum: ['INR', 'Dollar'],
        default: 'INR'
      },
    },
    required: false,
    default: {
      theme: 'light',
      currancy: 'INR'
    }
  },

  spendCategory: {
    type:[{
      name: {type: String, require: true},
      value: {type: String, require: true},
      active: {type: Boolean, required: true, default: true},
      color: {type: String, required: false, default: null},
    }],
    required: false,
    default: []
  },

  creditCategory: {
    type:[{
      name: {type: String, require: true},
      value: {type: String, require: true},
      active: {type: Boolean, required: true, default: true},
      color: {type: String, required: false, default: null},
    }],
    required: false,
    default: []
  },

})

userSchema.virtual("fullName").get(function() {
  return this.firstName + ' ' + this.lastName
})

module.exports = mongoose.model('User', userSchema);