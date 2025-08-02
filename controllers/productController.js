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
exports.getProducts = async (req, res) => {
  try {
    const { name, id } = req.query;

    let query = `SELECT * FROM products`;
    const params = [];

    if (id) {
      query += ` WHERE id = ?`;
      params.push(id);
    } else if (name) {
      query += ` WHERE name = ?`;
      params.push(name);
    }

    const [products] = await db.query(query, params);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];

    const updated = [];
    const failed = [];

    for (const item of updates) {
      const { id, name, price } = item;

      if (!id || (!name && !price)) {
        failed.push({ ...item, reason: "Product id and at least one of name or price is required." });
        continue;
      }

      const [existing] = await db.query(`SELECT * FROM products WHERE id = ?`, [id]);
      if (existing.length === 0) {
        failed.push({ ...item, reason: "Product not found." });
        continue;
      }

      if (name) {
        const [duplicate] = await db.query(
          `SELECT * FROM products WHERE name = ? AND id != ?`,
          [name, id]
        );
        if (duplicate.length > 0) {
          failed.push({ ...item, reason: "Product name already exists." });
          continue;
        }
      }

      const fields = [];
      const values = [];

      if (name) {
        fields.push("name = ?");
        values.push(name);
      }

      if (price) {
        fields.push("price = ?");
        values.push(price);
      }

      values.push(id);

      await db.query(
        `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      updated.push({ id, name, price });
    }

    res.status(200).json({
      message: "Product update(s) processed.",
      updated,
      failed
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating products", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const products = Array.isArray(req.body) ? req.body : [req.body];

    const deleted = [];
    const notFound = [];
    const notDeleted = [];
    const invalid = [];

    for (const item of products) {
      const { id } = item;

      if (!id) {
        invalid.push({ item, reason: "Product ID is required" });
        continue; 
      }

      const [existing] = await db.query(`SELECT * FROM products WHERE id = ?`, [id]);
      if (existing.length === 0) {
        notFound.push(id);
        continue;
      }

      const [rows] = await db.query(`SELECT * FROM order_items WHERE product_id = ?`, [id]);
      if (rows.length > 0) {
        notDeleted.push({ id, reason: "Product used in existing orders" });
        continue;
      }

      await db.query(`DELETE FROM products WHERE id = ?`, [id]);
      deleted.push({ id, message: "Product deleted" });
    }

    res.status(200).json({
      message: "Delete operation completed",
      deleted,
      notFound,
      notDeleted,
      invalid
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product(s)', error: error.message });
  }
};




