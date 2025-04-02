const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  token: String,
  status: String,
  amount: Number,
  buy_order: String,
  session_id: String,
  card_detail: {
    card_number: String,
  },
  authorization_code: String,
  payment_type_code: String,
  transaction_date: Date,
  installments_number: Number,
});

module.exports = mongoose.model('Transaction', transactionSchema);
