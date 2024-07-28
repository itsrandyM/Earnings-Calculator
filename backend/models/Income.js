const mongoose = require('mongoose');
const User = require('./User')
const Schema = mongoose.Schema;

const incomeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' ,required:true},
  month: String,
  year: Number,
  currency:String,
  techJobEarnings: Number,
  otherEarnings: Number,
  totalEarnings: Number,
  payableTax: Number,
  earningsSubjectToIncomeSharing: Number,
  amountDueToDirectEd: Number,
},
{timestamps:true}
);

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income
