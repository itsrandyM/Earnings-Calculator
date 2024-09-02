const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const User = require('../models/User');
const adminMiddleware = require('../middleware/admin');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const IncomeUpdateRequest = require('../models/updateRequest')

// routes/adminAuth.js

router.post('/login/admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ adminId: admin._id, admin: admin.admin}, process.env.JWT_SECRET, { expiresIn: '6h' });
    res.cookie('adminToken', token ,{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:'strict',
      maxAge: 7*24*60*1000
    })

    return res.status(201).json({ message:'Login successful!', admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/update-requests' ,adminMiddleware,async (req, res) => {
  try {
    const requests = await IncomeUpdateRequest.find({ status: { $ne: 'approved' } }).populate('incomeId').populate('userId').sort({ createdAt: -1 });
    res.status(200).json(requests);
    console.log(requests)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/update-request/:requestId' , adminMiddleware,async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    const updateRequest = await IncomeUpdateRequest.findById(requestId);
    if (!updateRequest) {
      return res.status(404).json({ message: 'Update request not found.' });
      // return res.status(200).json([]);
    }

    if (action === 'approve') {
      await Income.findByIdAndUpdate(updateRequest.incomeId, updateRequest.updatedData, {
        new: true,
        runValidators: true,
      });
      updateRequest.status = 'approved';
    } else if (action === 'reject') {
      updateRequest.status = 'rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action.' });
    }

    await updateRequest.save();
    res.status(200).json({ message: `Income update request ${action}ed successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// router.post('/login/admin', async (req, res) => {
//     try {
//       const { email, password } = req.body;
      
//       // Find the admin by email
//       let admin = await Admin.findOne({ email });
  
//       // If the admin does not exist, create a new admin
//       if (!admin) {
//         admin = new Admin({ email, password });
//         await admin.save();
//       } else if (!(await admin.comparePassword(password))) {
//         // If the admin exists but the password is incorrect
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Generate a token
//       const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
//       res.json({ token });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });



// Route to get all users
router.get('/students', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().populate('incomes');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/students/:id', adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the user by ID and populate the incomes array
      const user = await User.findById(id).populate('incomes');
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/update-requests-count', adminMiddleware, async (req, res) => {
    try {
      const count = await IncomeUpdateRequest.countDocuments({ status: 'pending' });
      res.status(200).json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  });

  router.post('/logout/admin', (req, res) => {
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(200).json({ message: 'Logout successful!' });
  });


module.exports = router;
