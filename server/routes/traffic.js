const express = require('express');
const router = express.Router();
const Traffic = require('../models/Traffic');
const { protect, adminOnly } = require('../middleware/auth');

// Seed data if empty
const seedTraffic = async () => {
  const count = await Traffic.countDocuments();
  if (count === 0) {
    await Traffic.insertMany([
      { name: 'Main Street', status: 'green', congestion: 15, incidents: 0, speed: 55 },
      { name: 'Highway 101', status: 'red', congestion: 92, incidents: 2, speed: 18 },
      { name: 'Downtown Ave', status: 'yellow', congestion: 58, incidents: 1, speed: 35 },
      { name: 'Ring Road', status: 'green', congestion: 22, incidents: 0, speed: 60 },
      { name: 'East Bypass', status: 'yellow', congestion: 45, incidents: 0, speed: 42 },
      { name: 'South Expressway', status: 'green', congestion: 10, incidents: 0, speed: 70 },
    ]);
    console.log('🚦 Traffic data seeded');
  }
};
seedTraffic().catch(console.error);

// GET /api/traffic - public
router.get('/traffic', async (req, res) => {
  try {
    const roads = await Traffic.find().sort({ name: 1 });
    res.json(roads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/traffic/:id - admin only
router.put('/traffic/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, congestion, incidents, speed } = req.body;
    const congestionNum = Number(congestion);
    const autoStatus = congestionNum >= 75 ? 'red' : congestionNum >= 40 ? 'yellow' : 'green';
    const road = await Traffic.findByIdAndUpdate(
      req.params.id,
      { status: status || autoStatus, congestion: congestionNum, incidents, speed, updatedAt: new Date() },
      { new: true }
    );
    if (!road) return res.status(404).json({ error: 'Road not found' });
    res.json(road);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/traffic - admin only
router.post('/traffic', protect, adminOnly, async (req, res) => {
  try {
    const { name, status, congestion, incidents, speed } = req.body;
    if (!name) return res.status(400).json({ error: 'Road name required' });
    const road = await Traffic.create({ name, status, congestion, incidents, speed });
    res.status(201).json(road);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
