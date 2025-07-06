const db = require("../../../../models");

const routes = {
  create: async (req, res) => {
    const { courierId, cityId, price, estimatedDays } = req.body;

    if (!courierId || !cityId || !price || !estimatedDays) {
      return res.status(400).json({ mess: "All fields are required" });
    }

    try {
      const pricing = await db.courierPricing.create({
        courierId,
        cityId,
        price,
        estimatedDays,
      });

      return res.status(201).json({ success: true, data: pricing });
    } catch (err) {
      console.error("Error creating pricing:", err);
      return res.status(500).json({ mess: err.message });
    }
  },

  list: async (req, res) => {
    try {
      const pricings = await db.courierPricing.findAll({
        include: [
          { model: db.courier },
          { model: db.city,include:{model:db.state,attributes:['name']} }
        ]
      });
      return res.json({ success: true, data: pricings });
    } catch (err) {
      console.error("Error fetching pricings:", err);
      return res.status(500).json({ mess: "Server error" });
    }
  },

  getById: async (req, res) => {
    const { id } = req.query;
    try {
      const pricing = await db.courierPricing.findByPk(id, {
        include: [db.courier, db.city]
      });
      if (!pricing) return res.status(404).json({ mess: "Pricing not found" });
      return res.json({ success: true, data: pricing });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ mess: "Server error" });
    }
  },

  update: async (req, res) => {
    const { id } = req.query;
    const { courierId, cityId, price, estimatedDays } = req.body;

    try {
      const pricing = await db.courierPricing.findByPk(id);
      if (!pricing) return res.status(404).json({ mess: "Pricing not found" });

      await pricing.update({ courierId, cityId, price, estimatedDays });
      return res.json({ success: true, mess: "Pricing updated" });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ mess: "Server error" });
    }
  },

  delete: async (req, res) => {
    const { id } = req.query;
    try {
      const pricing = await db.courierPricing.findByPk(id);
      if (!pricing) return res.status(404).json({ mess: "Pricing not found" });

      await pricing.destroy();
      return res.json({ success: true, mess: "Pricing deleted" });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ mess: "Server error" });
    }
  }
};

module.exports = routes;

