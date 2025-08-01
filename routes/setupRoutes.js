const express = require('express');
const router = express.Router();
const { createAlltables } = require('../controllers/setupController');

router.post('/', createAlltables);
router.get('/',createAlltables )

module.exports = router;


