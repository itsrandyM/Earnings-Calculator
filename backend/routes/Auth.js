const express = require('express')
const router = express.Router()
const {SignUp, Login, Logout} = require('../controllers/Auth')

router.post('/Signup',SignUp)
router.post('/Login',Login)
router.post('/Logout',Logout)

module.exports = router