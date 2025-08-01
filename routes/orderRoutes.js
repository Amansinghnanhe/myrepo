const express = require('express');
const router = express.Router();
const { addOrder,getOrders, updateOrder } = require('../controllers/orderController');

router.post('/', addOrder);
router.get('/', getOrders);
router.put('/', updateOrder);

module.exports = router;
