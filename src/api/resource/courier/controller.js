const db = require("../../../../models");

const routes = {
create: async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ mess: "Courier name is required" });
  }

  try {
    const existing = await db.courier.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ mess: "Courier with this name already exists" });
    }

    const courier = await db.courier.create({ name });
    return res.status(201).json({ success: true, data: courier });
  } catch (err) {
    console.error("Error creating courier:", err);
    return res.status(500).json({ mess: err.message });
  }
},


  list: async (req, res) => {
    try {
      const couriers = await db.courier.findAll();
      return res.json({ success: true, data: couriers });
    } catch (err) {
      console.error("Error fetching couriers:", err);
      return res.status(500).json({ mess: "Server error" });
    }
  },

  getById: async (req, res) => {
    const { id } = req.query;
    try {
      const courier = await db.courier.findByPk(id);
      if (!courier) return res.status(404).json({ mess: "Courier not found" });
      return res.json({ success: true, data: courier });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ mess: "Server error" });
    }
  },

 update: async (req, res) => {
  const { id } = req.query;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ mess: "Courier name is required" });
  }

  try {
    const courier = await db.courier.findByPk(id);
    if (!courier) {
      return res.status(404).json({ mess: "Courier not found" });
    }

    // Check for duplicate name in *other* records
    const duplicate = await db.courier.findOne({
      where: { name, id: { [db.Sequelize.Op.ne]: id } }
    });

    if (duplicate) {
      return res.status(400).json({ mess: "Another courier with this name already exists" });
    }

    await courier.update({ name });
    return res.json({ success: true, mess: "Courier updated" });
  } catch (err) {
    console.error("Error updating courier:", err);
    return res.status(500).json({ mess: "Server error" });
  }
},


  delete: async (req, res) => {
    const { id } = req.query;
    try {
      const courier = await db.courier.findByPk(id);
      if (!courier) return res.status(404).json({ mess: "Courier not found" });

      await courier.destroy();
      return res.json({ success: true, mess: "Courier deleted" });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ mess: "Server error" });
    }
  }
};

module.exports = routes;

