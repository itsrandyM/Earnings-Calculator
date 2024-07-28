const Income =  require('../models/Income')
const User = require('../models/User')
const mongoose = require('mongoose')

//Create income entry
exports.createIncome = async (req, res) => {
  try {
    const { month, year, currency, techJobEarnings, otherEarnings, totalEarnings, payableTax, earningsSubjectToIncomeSharing, amountDueToDirectEd } = req.body;
    const userId = req.user.id;

    // Validate the required fields
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required.' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create and save the new income entry
    const income = new Income({ userId, month, year, currency, techJobEarnings, otherEarnings, totalEarnings, payableTax, earningsSubjectToIncomeSharing, amountDueToDirectEd });
    await income.save();

    // Add the new income ID to the user's incomes array
    user.incomes.push(income._id);
    await user.save();

    res.status(201).json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

  // Update an income entry
exports.updateIncome = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid income ID.' });
      }
  
      // Update the income entry
      const income = await Income.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  
      if (!income) {
        return res.status(404).json({ message: 'Income not found.' });
      }
  
      res.status(200).json(income);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };
  
  // Delete an income entry
  exports.deleteIncome = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid income ID.' });
      }
  
      // Delete the income entry
      const income = await Income.findByIdAndDelete(id);
  
      if (!income) {
        return res.status(404).json({ message: 'Income not found.' });
      }
  
      res.status(204).end(); // No content
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };

  exports.getIncomeById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid income ID.' });
      }
  
      // Get the income entry
      const income = await Income.findById(id);
  
      if (!income) {
        return res.status(404).json({ message: 'Income not found.' });
      }
  
      res.status(200).json(income);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };

// Get all income entries for the authenticated user
exports.getIncomesByUser = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Find all income entries for the user
      const incomes = await Income.find({ userId }).sort({ createdAt: -1 });
  
      if (!incomes.length) {
        return res.status(404).json({ message: 'No incomes found for this user.' });
      }
  
      res.status(200).json(incomes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };