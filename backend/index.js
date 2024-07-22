require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express();

//Routes
const AuthRouter = require('./routes/Auth')
const userRouter = require('./routes/UserRoute')
const incomeRouter = require('./routes/Income')
app.use(express.json());
const mongoUri = process.env.MONGO_URI;

//routes
app.use('/auth',AuthRouter)
app.use('/api/user', userRouter)
app.use('/api/income',incomeRouter)


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