const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  month: Number,
  year: Number,
  techJobEarnings: Number,
  otherEarnings: Number,
  totalEarnings: Number,
  payableTax: Number,
  earningsSubjectToIncomeSharing: Number,
  amountDueToDirectEd: Number,
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = {Income};
