const db = require('../config/db')

exports.addCustomer = async (req, res) => {
  try {
    const customers = Array.isArray(req.body) ? req.body : [req.body];

    const inserted = [];
    const duplicates = [];

    for (const customer of customers) {
      const { name, email } = customer;

      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required." });
      }

      const [existing] = await db.query(
        `SELECT * FROM customers WHERE email = ?`,
        [email]
      );

      if (existing.length > 0) {
        duplicates.push(email);
        continue;
      }

      await db.query(
        `INSERT INTO customers (name, email) VALUES (?, ?)`,
        [name, email]
      );
      inserted.push(email);
    }

    res.status(201).json({
      message: 'Customer(s) processed.',
      inserted,
      duplicates
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getCustomers = async (req, res) => {
  try {
    const { email } = req.query;

    let query = `SELECT * FROM customers`;
    let params = [];

    if (email) {
      query += ` WHERE email = ?`;
      params.push(email);
    }

    const [customers] = await db.query(query, params);

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


