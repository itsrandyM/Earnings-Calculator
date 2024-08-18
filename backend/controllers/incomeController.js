const Income =  require('../models/Income')
const User = require('../models/User')
const mongoose = require('mongoose')
const IncomeUpdateRequest = require('../models/updateRequest')
const bcrypt = require('bcrypt')



exports.createIncome = async (req, res) => {
  try {
    const { incomeData } = req.body;
    const userId = req.user.id;

    // Validate the required fields
    if (!incomeData || !Array.isArray(incomeData) || incomeData.length === 0) {
      return res.status(400).json({ message: 'Income data is required and should be a non-empty array.' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Array to hold the created income entries
    const createdIncomes = [];

    // Loop through each income entry in the array
    for (const incomeEntry of incomeData) {
      const {
        month,
        year,
        currency,
        techJobEarnings,
        otherEarnings,
        totalEarnings,
        payableTax,
        earningsSubjectToIncomeSharing,
        amountDueToDirectEd,
        link,
        comment
      } = incomeEntry;

      // Validate the required fields for each entry
      if (!month || !year) {
        return res.status(400).json({ message: 'Month and year are required for each income entry.' });
      }

      // Create and save the new income entry
      const income = new Income({
        userId,
        month,
        year,
        currency,
        techJobEarnings,
        otherEarnings,
        totalEarnings,
        payableTax,
        earningsSubjectToIncomeSharing,
        amountDueToDirectEd,
        link,
        comment
      });
      await income.save();

      // Add the new income ID to the user's incomes array
      user.incomes.push(income._id);

      // Add the created income to the list
      createdIncomes.push(income);
    }

    // Save the user after updating their incomes array
    await user.save();

    // Return the array of created income entries
    res.status(201).json(createdIncomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

//Create income entry
// exports.createIncome = async (req, res) => {
//   try {
//     const { month, year, currency, techJobEarnings, otherEarnings, totalEarnings, payableTax, earningsSubjectToIncomeSharing, amountDueToDirectEd } = req.body;
//     const userId = req.user.id;

//     // Validate the required fields
//     if (!month || !year) {
//       return res.status(400).json({ message: 'Month and year are required.' });
//     }

//     // Check if the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     // Create and save the new income entry
//     const income = new Income({ userId, month, year, currency, techJobEarnings, otherEarnings, totalEarnings, payableTax, earningsSubjectToIncomeSharing, amountDueToDirectEd });
//     await income.save();

//     // Add the new income ID to the user's incomes array
//     user.incomes.push(income._id);
//     await user.save();

//     res.status(201).json(income);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error.' });
//   }
// };

exports.requestIncomeUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid income ID.' });
    }

    const income = await Income.findById(id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found.' });
    }

    const updateRequest = new IncomeUpdateRequest({
      incomeId: id,
      userId: req.user.id,
      originalData: income.toObject(),
      updatedData: updates,
      context: updates.context || '',
    });

    await updateRequest.save();
    res.status(200).json({ message: 'Update request submitted successfully.' });
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
  
  exports.deleteIncome = async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body; // Password should be in the request body
  
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid income ID.' });
      }
  
      // Retrieve the income entry
      const income = await Income.findById(id);
  
      if (!income) {
        return res.status(404).json({ message: 'Income not found.' });
      }
  
      // Retrieve the user
      const user = await User.findById(income.userId); // Assuming the income model has a reference to the user
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Verify the password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid password.' });
      }
  
      // Delete the income entry
      await Income.findByIdAndDelete(id);
  
      res.status(204).end(); // No content
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };

  // Delete an income entry
  // exports.deleteIncome = async (req, res) => {
  //   try {
  //     const { id } = req.params;
  
  //     // Validate the ID
  //     if (!mongoose.Types.ObjectId.isValid(id)) {
  //       return res.status(400).json({ message: 'Invalid income ID.' });
  //     }
  
  //     // Delete the income entry
  //     const income = await Income.findByIdAndDelete(id);
  
  //     if (!income) {
  //       return res.status(404).json({ message: 'Income not found.' });
  //     }
  
  //     res.status(204).end(); // No content
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server error.' });
  //   }
  // };


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

    // Instead of returning a 404, return an empty array with a 200 status
    if (!incomes.length) {
      return res.status(200).json([]); // Return an empty array
    }

    res.status(200).json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.fetchIncomeUpdates = async (req, res) => {
  try {
    const requests = await IncomeUpdateRequest.find({ userId: req.user.id }).populate('incomeId').populate('userId').sort({ createdAt: -1 });
    res.status(200).json(requests);
    console.log(requests)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};