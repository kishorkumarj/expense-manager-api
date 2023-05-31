const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  account_name: {type: String, required: true},
  account_type: {
    type: String, 
    required: true,
    enum: ['Credit Card', 'Account', 'Loan', 'Investment', 'Other'],
  },
  card_number: {type: String, required: false},
  account_number: {type: String, required: false},
  balance: {type: Number, required: false, default: 0},
  active: {type: Number, required: true, default: true},
  user_id: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  transactions: {
    type: [{
      name: {type: String, required: true},
      date: {type: Date, required: true},
      category: { type: String, required: false, default: 'Other'},
      amount: {type: Number, required: true},
      expense: {type: Boolean, required: true, default: true},
      income: {type: Boolean, required: true, default: false},
      currency: {type: String, default: 'INR'},
      note: {type: String, required: false},
      tags: {type: [{
        type: String,
        required: false
      }]},
      date_added: {type: Date, required: true},
    }]
  },
});

module.exports = mongoose.model('Accounts', accountSchema);