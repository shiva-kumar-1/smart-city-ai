const express = require('express');
const router = express.Router();
const Parking = require('../models/Parking');
const Traffic = require('../models/Traffic');
const RoadDamage = require('../models/RoadDamage');

router.get('/dashboard', async (req, res) => {
  try {
    const [parkingData, trafficData, damageData] = await Promise.all([
      Parking.aggregate([
        {
          $group: {
            _id: null,
            totalSlots: { $sum: '$totalSlots' },
            availableSlots: { $sum: '$availableSlots' },
          },
        },
      ]),
      Traffic.find(),
      RoadDamage.countDocuments({ status: { $in: ['pending', 'under_review'] } }),
    ]);

    const parking = parkingData[0] || { totalSlots: 0, availableSlots: 0 };

    const avgCongestion =
      trafficData.length > 0
        ? Math.round(trafficData.reduce((s, r) => s + r.congestion, 0) / trafficData.length)
        : 0;

    const redRoads = trafficData.filter((r) => r.status === 'red').length;
    const trafficStatus =
      redRoads >= 2 ? 'Heavy' : avgCongestion >= 60 ? 'Moderate' : 'Smooth';

    const activeIncidents = trafficData.reduce((s, r) => s + (r.incidents || 0), 0);

    res.json({
      totalSlots: parking.totalSlots,
      availableSlots: parking.availableSlots,
      occupancyRate: parking.totalSlots
        ? Math.round(((parking.totalSlots - parking.availableSlots) / parking.totalSlots) * 100)
        : 0,
      trafficStatus,
      avgCongestion,
      activeIncidents,
      pendingRoadReports: damageData,
      totalRoads: trafficData.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
