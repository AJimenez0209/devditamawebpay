import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  buy_order: String,
  session_id: String,
  amount: Number,
  status: String,
  card_detail: Object,
  transaction_date: String,
  authorization_code: String,
  payment_type_code: String,
  response_code: Number,
  installments_number: Number,
  message: String,
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
