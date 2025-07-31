const db = require('../config/db')
exports.addOrder = async (req, res) => {
  try {
    const orders = Array.isArray(req.body) ? req.body : [req.body];  

    const success = [];
    const failed = [];

    for (const order of orders) {
      const { customer_id, items } = order;

      if (!customer_id || !Array.isArray(items) || items.length === 0) {
        failed.push({ customer_id, reason: 'Invalid order structure' });
        continue;
      }
      const [customer] = await db.query(`SELECT id FROM customers WHERE id = ?`, [customer_id]);
      if (customer.length === 0) {
        failed.push({ customer_id, reason: 'Customer not found' });
        continue;
      }
      const [orderResult] = await db.query(`INSERT INTO orders (customer_id) VALUES (?)`, [customer_id]);
      const orderId = orderResult.insertId;

      let valid = true;

      for (const item of items) {
        const [product] = await db.query(`SELECT id FROM products WHERE id = ?`, [item.product_id]);
        if (product.length === 0) {
          valid = false;
          failed.push({ customer_id, reason: `Invalid product ID: ${item.product_id}` });
          break;
        }

        await db.query(
          `INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`,
          [orderId, item.product_id, item.quantity]
        );
      }

      if (valid) {
        success.push({ customer_id, order_id: orderId });
      }
    }

    res.status(201).json({
      message: 'Orders processed.',
      success,
      failed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
