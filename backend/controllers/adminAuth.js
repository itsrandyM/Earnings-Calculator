// routes/adminAuth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// router.post('/login/admin', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const admin = await Admin.findOne({ email });

//     if (!admin || !(await admin.comparePassword(password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.post('/login/admin', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find the admin by email
      let admin = await Admin.findOne({ email });
  
      // If the admin does not exist, create a new admin
      if (!admin) {
        admin = new Admin({ email, password });
        await admin.save();
      } else if (!(await admin.comparePassword(password))) {
        // If the admin exists but the password is incorrect
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate a token
      const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
