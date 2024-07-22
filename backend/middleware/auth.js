const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }
        return res.status(403).json({ message: 'Invalid token.' });
      }

      // Fetch the user from the database if needed (optional)
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }

      // Attach user to request object
      req.user = {
        id: decoded.id,
        // Add other user properties if needed
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