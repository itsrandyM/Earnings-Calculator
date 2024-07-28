// corsOptions.js

const allowedOrigins = ['https://earnings-calculator.vercel.app'];

const corsOptions = (req, callback) => {
    console.log('Request Origin:', req.header('Origin'));
  let corsOptions;
  if (allowedOrigins.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // Allow the request
  } else {
    corsOptions = { origin: false }; // Block the request
  }
  callback(null, corsOptions);
};

module.exports = corsOptions;
