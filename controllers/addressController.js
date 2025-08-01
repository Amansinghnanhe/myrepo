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
exports.getAddresses = async (req, res) => {
  try {
    const { customer_id } = req.query;

    let query = `SELECT * FROM addresses`;
    let params = [];

    if (customer_id) {
      query += ` WHERE customer_id = ?`;
      params.push(customer_id);
    }

    const [addresses] = await db.query(query, params);

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateAddress = async (req, res) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];

    const updated = [];
    const failed = [];

    for (const item of updates) {
      const { id, customer_id, new_address } = item;

      if (!id || !customer_id || !new_address) {
        failed.push({ ...item, reason: "id, customer_id, and new_address are required" });
        continue;
      }

      
      const [existing] = await db.query(
        `SELECT * FROM addresses WHERE id = ? AND customer_id = ?`,
        [id, customer_id]
      );

      if (existing.length === 0) {
        failed.push({ ...item, reason: "Address not found" });
        continue;
      }

    
      const [duplicate] = await db.query(
        `SELECT * FROM addresses WHERE customer_id = ? AND address = ? AND id != ?`,
        [customer_id, new_address, id]
      );

      if (duplicate.length > 0) {
        failed.push({ ...item, reason: "New address already exists for this customer" });
        continue;
      }

      
      await db.query(
        `UPDATE addresses SET address = ? WHERE id = ? AND customer_id = ?`,
        [new_address, id, customer_id]
      );

      updated.push({ id, customer_id, new_address });
    }

    res.status(200).json({
      message: "Address update(s) processed.",
      updated,
      failed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteAddress = async (req, res) => {
  try {
    const addresses = Array.isArray(req.body) ? req.body : [req.body];

    const deleted = [];
    const notFound = [];

    for (const addr of addresses) {
      const { customer_id, address } = addr;

      if (!customer_id || !address) {
        return res.status(400).json({ message: "customer_id and address are required" });
      }

      const [result] = await db.query(
        `DELETE FROM addresses WHERE customer_id = ? AND address = ?`,
        [customer_id, address]
      );

      if (result.affectedRows > 0) {
        deleted.push({ customer_id, address });
      } else {
        notFound.push({ customer_id, address });
      }
    }

    res.status(200).json({
      message: "Delete operation completed",
      deleted,
      notFound
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




