const express = require('express');
const router = express.Router();
const Parking = require('../models/Parking');
const { protect, adminOnly } = require('../middleware/auth');

// Seed data if empty
const seedParking = async () => {
  const count = await Parking.countDocuments();
  if (count === 0) {
    await Parking.insertMany([
      { name: 'City Center Parking', address: '123 Main St', zone: 'Central', totalSlots: 50, availableSlots: 18, pricePerHour: 30 },
      { name: 'North Zone Garage', address: '45 North Ave', zone: 'North', totalSlots: 80, availableSlots: 35, pricePerHour: 20 },
      { name: 'South Mall Parking', address: '78 South Blvd', zone: 'South', totalSlots: 60, availableSlots: 42, pricePerHour: 25 },
      { name: 'East Tech Park', address: '10 Tech Road', zone: 'East', totalSlots: 120, availableSlots: 5, pricePerHour: 15 },
      { name: 'West Station Hub', address: '5 Station Way', zone: 'West', totalSlots: 200, availableSlots: 88, pricePerHour: 10 },
    ]);
    console.log('🚗 Parking data seeded');
  }
};
seedParking().catch(console.error);

// GET /api/parking - public
router.get('/parking', async (req, res) => {
  try {
    const locations = await Parking.find().sort({ name: 1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/parking/reserve/:id - protected
router.post('/parking/reserve/:id', protect, async (req, res) => {
  try {
    const loc = await Parking.findById(req.params.id);
    if (!loc) return res.status(404).json({ error: 'Parking lot not found' });
    if (loc.availableSlots <= 0) return res.status(400).json({ error: 'No slots available' });
    loc.availableSlots -= 1;
    loc.updatedAt = new Date();
    await loc.save();
    res.json(loc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/parking/release/:id - protected
router.post('/parking/release/:id', protect, async (req, res) => {
  try {
    const loc = await Parking.findById(req.params.id);
    if (!loc) return res.status(404).json({ error: 'Parking lot not found' });
    if (loc.availableSlots >= loc.totalSlots) return res.status(400).json({ error: 'Already at full capacity' });
    loc.availableSlots += 1;
    loc.updatedAt = new Date();
    await loc.save();
    res.json(loc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/parking - admin add new lot
router.post('/parking', protect, adminOnly, async (req, res) => {
  try {
    const { name, address, zone, totalSlots, pricePerHour } = req.body;
    if (!name || !address || !totalSlots) return res.status(400).json({ error: 'Name, address, totalSlots required' });
    const lot = await Parking.create({ name, address, zone, totalSlots, availableSlots: totalSlots, pricePerHour });
    res.status(201).json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
