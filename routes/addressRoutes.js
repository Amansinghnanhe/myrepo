const express = require('express');
const router = express.Router();
const { addAddress, getAddresses,updateAddress } = require('../controllers/addressController');

router.post('/', addAddress);
router.get('/', getAddresses);
router.put('/', updateAddress);

module.exports = router;

