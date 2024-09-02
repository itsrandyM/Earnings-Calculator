require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const app = express();
const corsOptions = require('./config/corsOptions')

//cross-origins
app.use(cookieParser())
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(express.json());

//Routes
const AuthRouter = require('./routes/Auth')
const userRouter = require('./routes/UserRoute')
const incomeRouter = require('./routes/Income')
const adminRoutes = require('./routes/AdminRoutes')



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