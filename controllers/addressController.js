const db = require('../config/db')

exports.addAddress = async (req, res) => {
  try {
    const addresses = Array.isArray(req.body) ? req.body : [req.body];

    for (const addr of addresses) {
      const { customer_id, address } = addr;
      if (!customer_id || !address) {
        return res.status(400).json({ message: "customer_id and address are required" });
      }
      const [existing] = await db.query(
        `SELECT * FROM addresses WHERE customer_id = ? AND address = ?`,
        [customer_id, address]
      );
      if (existing.length > 0) {
        continue; 
      }
      await db.query(
        `INSERT INTO addresses (customer_id, address) VALUES (?, ?)`,
        [customer_id, address]
      );
    }
    res.status(201).json({ message: "Address(es) added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

