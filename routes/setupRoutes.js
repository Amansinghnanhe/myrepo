const express = require('express');
const router = express.Router();
const { createAlltables } = require('../controllers/setupController');

router.post('/', createAlltables);
router.get('/', createAlltables );
router.put('/', createAlltables );
router.delete('/', createAlltables );

module.exports = router;


