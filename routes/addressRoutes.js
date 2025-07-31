const express = require('express');
const router = express.Router();
const { addAddress, getAddresses } = require('../controllers/addressController');

router.post('/', addAddress);
router.get('/', getAddresses);

module.exports = router;

