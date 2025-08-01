const express = require('express');
const router = express.Router();
const { addProduct, getProducts, updateProduct } = require('../controllers/productController');


router.post('/', addProduct);
router.get('/', getProducts);
router.put('/', updateProduct);

module.exports = router;
