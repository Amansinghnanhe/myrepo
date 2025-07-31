const db = require('../config/db')

exports.addProduct = async (req, res) => {
  try {
    const products = Array.isArray(req.body) ? req.body : [req.body]; 

    const success = [];
    const failed = [];

    for (const product of products) {
      const { name, price } = product;

      if (!name || !price) {
        failed.push({ name, reason: 'Missing name or price' });
        continue;
      }
      const [existing] = await db.query(`SELECT * FROM products WHERE name = ?`, [name]);
      if (existing.length > 0) {
        failed.push({ name, reason: 'Product already exists' });
        continue;
      }
      await db.query(`INSERT INTO products (name, price) VALUES (?, ?)`, [name, price]);
      success.push({ name });
    }

    res.status(201).json({
      message: 'Products processed.',
      success,
      failed
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding products', error: error.message });
  }
};
