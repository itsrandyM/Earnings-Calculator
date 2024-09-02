const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const authenticateToken = async (req, res, next) => {
  try {
    // const token = req.headers['authorization']?.split(' ')[1];
    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }
        return res.status(403).json({ message: 'Invalid token.' });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }

      req.user = {
        id: decoded.id,

      };

      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = authenticateToken;

// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); 

// const authenticateToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
  
//   if (!token) return res.status(401).json({ message: 'Access denied.' });

//   jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token.' });
//     req.user = user; 
//     next();
//   });
// };

// module.exports = authenticateToken;

// middleware/auth.js