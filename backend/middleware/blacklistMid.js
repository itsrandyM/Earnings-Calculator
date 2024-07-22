const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const blacklistedToken = await Blacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
