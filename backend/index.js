require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const app = express();

//Routes
const AuthRouter = require('./routes/Auth')
const userRouter = require('./routes/UserRoute')
const incomeRouter = require('./routes/Income')
const adminRoutes = require('./routes/AdminRoutes')
app.use(cors({
    origin: 'https://earnings-calculator.vercel.app/', 
    credentials: true, 
  }));
  
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

//routes
app.use('/auth',AuthRouter)
app.use('/api/user', userRouter)
app.use('/api/income',incomeRouter)
app.use('/api', adminRoutes)


mongoose.connect(mongoUri)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Connected to MongoDB');
        console.log('Server listening on port', process.env.PORT);
    });
})
.catch((err) => {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
});