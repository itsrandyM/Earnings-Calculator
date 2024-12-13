// corsOptions.js

const allowedOrigins = [
  'https://earnings-calculator.vercel.app', 
  'http://localhost:5173',
  'https://66a74ba149e18b0008de12ba--directedpay.netlify.app',
  'https://earnings-calculator-2se.onrender.com',
  'https://earnings-calculator-1.onrender.com'
];

// const corsOptions = (req, callback) => {
//     console.log('Request Origin:', req.header('Origin'));
//   let corsOptions;
//   if (allowedOrigins.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true , Credential:true}; // Allow the request
//   } else {
//     corsOptions = { origin: false }; // Block the request
//   }
//   callback(null, corsOptions);
// };

const corsOptions = {
  origin: allowedOrigins, 
  credentials: true,      
  optionsSuccessStatus: 200 
};

module.exports = corsOptions;
