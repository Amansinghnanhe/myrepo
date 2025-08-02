const express = require('express');
const router = express.Router();
const { addCustomer, getCustomers, updateCustomer, deleteCustomer } = require('../controllers/customerController');

router.post('/', addCustomer);
router.get('/', getCustomers);
router.put('/', updateCustomer);
router.delete('/', deleteCustomer);
module.exports = router;
