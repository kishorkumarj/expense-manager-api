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
  }

})

userSchema.virtual("fullName").get(function() {
  return this.firstName + ' ' + this.lastName
})

module.exports = mongoose.model('User', userSchema);