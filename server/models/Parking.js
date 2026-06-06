const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  zone: { type: String, default: 'General' },
  totalSlots: { type: Number, required: true },
  availableSlots: { type: Number, required: true },
  pricePerHour: { type: Number, default: 0 },
  coordinates: { lat: Number, lng: Number },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Parking', parkingSchema);
