const createTables = require('../models/createTables');

exports.createAlltables = async (req, res) => {
  try {
    createTables()
    res.status(200).json({ message: "All tables created successfully." });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};
