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
exports.getOrders = async (req, res) => {
  try {
    const { customer_id } = req.query;

    let query = `
      SELECT 
        o.id AS order_id,
        o.customer_id,
        p.id AS product_id,
        p.name AS product_name,
        p.price,
        oi.quantity
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
    `;
    
    const params = [];

    if (customer_id) {
      query += ` WHERE o.customer_id = ?`;
      params.push(customer_id);
    }

    const [orders] = await db.query(query, params);

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateOrder = async (req, res) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];

    const updated = [];
    const failed = [];

    for (const order of updates) {
      const { order_id, customer_id, items } = order;

      if (!order_id || !customer_id || !Array.isArray(items) || items.length === 0) {
        failed.push({ order_id, reason: "order_id, customer_id, and items are required" });
        continue;
      }

      
      const [existingOrder] = await db.query(
        `SELECT * FROM orders WHERE id = ? AND customer_id = ?`,
        [order_id, customer_id]
      );

      if (existingOrder.length === 0) {
        failed.push({ order_id, reason: "Order not found or does not belong to the customer" });
        continue;
      }

      await db.query(`DELETE FROM order_items WHERE order_id = ?`, [order_id]);

      let valid = true;

      for (const item of items) {
        const [product] = await db.query(`SELECT id FROM products WHERE id = ?`, [item.product_id]);
        if (product.length === 0) {
          valid = false;
          failed.push({ order_id, reason: `Invalid product ID: ${item.product_id}` });
          break;
        }

        await db.query(
          `INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`,
          [order_id, item.product_id, item.quantity]
        );
      }

      if (valid) {
        updated.push({ order_id, customer_id });
      }
    }

    res.status(200).json({
      message: "Order update(s) processed.",
      updated,
      failed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



