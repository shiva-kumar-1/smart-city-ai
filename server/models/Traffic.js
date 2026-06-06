const mongoose = require('mongoose');

const trafficSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['green', 'yellow', 'red'], default: 'green' },
  congestion: { type: Number, min: 0, max: 100, default: 0 },
  incidents: { type: Number, default: 0 },
  speed: { type: Number, default: 60 }, // km/h
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Traffic', trafficSchema);
