const express = require('express')
const router = express.Router()
const {updateUser, deleteUser, getUserById} = require('../controllers/userController')

router.route('/:id')
           .patch(updateUser)
           .delete(deleteUser)
           .get(getUserById)


module.exports = router