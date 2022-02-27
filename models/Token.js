const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  token: {type: String, required: true},
  refresh_token: {type: String, required: false},
  user_id: {type: mongoose.Types.ObjectId, ref:'User', required: true},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Token", tokenSchema);