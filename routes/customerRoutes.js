const express = require('express');
const router = express.Router();
const { addCustomer, getCustomers, updateCustomer } = require('../controllers/customerController');

router.post('/', addCustomer);
router.get('/', getCustomers);
router.put('/', updateCustomer);
module.exports = router;
