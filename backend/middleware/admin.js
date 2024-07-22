// middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);

    if (admin) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = adminMiddleware;
