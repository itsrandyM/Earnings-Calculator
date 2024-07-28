// corsOptions.js

const allowedOrigins = ['https://earnings-calculator.vercel.app','http://localhost:5173'];

const corsOptions = (req, callback) => {
  let corsOptions;
  if (allowedOrigins.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // Allow the request
  } else {
    corsOptions = { origin: false }; // Block the request
  }
  callback(null, corsOptions);
};

module.exports = corsOptions;
