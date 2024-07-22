const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Blacklist = require('../models/blacklist');
const expressAsyncHandler = require('express-async-handler')

const SignUp = expressAsyncHandler(async (req, res) => {
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
      
        if (
          !firstName ||
          !lastName ||
          !email ||
          !password ||
          !mobilePhone ||
          !countryOfResidence ||
          !cohortYear ||
          !parentFirstName ||
          !parentLastName ||
          !parentEmail ||
          !parentMobilePhone
        ) {
          res.status(400);
          throw new Error('All fields are required');
        }
      
        const userExists = await User.findOne({ email });
      
        if (userExists) {
          res.status(400);
          throw new Error('User already exists');
        }
      
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
      
        const user = await User.create({
          firstName,
          middleName,
          lastName,
          email,
          password: hashedPassword,
          mobilePhone,
          countryOfResidence,
          cohortYear,
          parentFirstName,
          parentMiddleName,
          parentLastName,
          parentEmail,
          parentMobilePhone
        });
      
        if (user) {
            const token = generateToken(user._id, user.email);
          res.status(201).json({
            _id: user._id,
            email: user.email,
            token: token,
            message: 'Signup successful, you are now logged in!'
          });
        } else {
          res.status(400);
          throw new Error('Invalid user data');
        }
      }
)

const Login = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }
  
    const user = await User.findOne({ email });
  
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id, user.email);
      res.json({
        _id: user._id,
        email: user.email,
        token: token,
        message: 'Login Successful'
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  })

const Logout = expressAsyncHandler(async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      res.status(400);
      throw new Error('No token provided');
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    // Add token to blacklist
    await Blacklist.create({
      token,
      expiresAt: new Date(decoded.exp * 1000) // Token expiry time in milliseconds
    });
  
    res.json({ message: 'Logged out successfully' });
  })

// Generate JWT
const generateToken = (id,email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });
  };

module.exports = {SignUp,Login,Logout}