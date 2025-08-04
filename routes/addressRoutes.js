const express = require('express');
const router = express.Router();
const { addAddress, getAddresses,updateAddress, deleteAddress } = require('../controllers/addressController');

router.post('/', addAddress);
router.get('/', getAddresses);
router.put('/', updateAddress);
router.delete('/', deleteAddress);

module.exports = router;

