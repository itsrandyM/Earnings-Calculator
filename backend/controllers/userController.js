const User = require('../models/User');
const bcrypt = require('bcrypt')
const expressAsyncHandler = require('express-async-handler');

const updateUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      mobilePhone,
      countryOfResidence,
      cohortYear,
      parentFirstName,
      parentMiddleName,
      parentLastName,
      parentEmail,
      parentMobilePhone
    } = req.body;
  
    const user = await User.findById(id);
  
    if (user) {
      user.firstName = firstName || user.firstName;
      user.middleName = middleName || user.middleName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      user.mobilePhone = mobilePhone || user.mobilePhone;
      user.countryOfResidence = countryOfResidence || user.countryOfResidence;
      user.cohortYear = cohortYear || user.cohortYear;
      user.parentFirstName = parentFirstName || user.parentFirstName;
      user.parentMiddleName = parentMiddleName || user.parentMiddleName;
      user.parentLastName = parentLastName || user.parentLastName;
      user.parentEmail = parentEmail || user.parentEmail;
      user.parentMobilePhone = parentMobilePhone || user.parentMobilePhone;
  
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        email: updatedUser.email,
        message: 'User updated successfully',
        update:updatedUser
      });  
    } else {
      res.status(404).json({ message: 'User not found!' });
      throw new Error('User not found');
    }
  })


  const deleteUser = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const user = await User.findById(id);
  
    if (user) {
      await user.deleteOne();
      res.json({ message: 'User deleted.' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
})

const getUserById = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const user = await User.findById(id);
  
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
      throw new Error('User not found');
    }
  });

//   const getAllUsers = expressAsyncHandler(async (req, res) => {
//     const users = await User.find({});
//     res.json(users);
//   });

module.exports = {updateUser, deleteUser, getUserById}
// 0112707734 - esther.