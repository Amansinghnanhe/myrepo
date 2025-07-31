const express = require('express');
const router = express.Router();
const { addCustomer } = require('../controllers/customerController');

router.post('/', addCustomer);
module.exports = router;
