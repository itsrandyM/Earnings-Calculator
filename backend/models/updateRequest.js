const mongoose = require('mongoose');

const incomeUpdateRequestSchema = new mongoose.Schema({
  incomeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Income', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalData: { type: Object, required: true },
  updatedData: { type: Object, required: true },
  context: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const IncomeUpdateRequest = mongoose.model('IncomeUpdateRequest', incomeUpdateRequestSchema);

module.exports = IncomeUpdateRequest;
