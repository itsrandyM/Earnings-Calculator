const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/auth')
const { createIncome, updateIncome, deleteIncome, getIncomeById, getIncomesByUser, requestIncomeUpdate } = require('../controllers/incomeController')

router.use(authenticateToken)

router.post('/', createIncome)
router.get('/', getIncomesByUser)
router.route('/:id')
           .patch(updateIncome)
           .delete(deleteIncome)
           .get(getIncomeById)
router .post('/:id/request-update',requestIncomeUpdate)
         
module.exports = router