const mongoose = require('mongoose');

const roadDamageSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  coordinates: { lat: Number, lng: Number },
  damageType: {
    type: String,
    enum: ['pothole', 'crack', 'subsidence', 'flooding', 'debris', 'other'],
    required: true,
  },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: null },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'in_progress', 'resolved'],
    default: 'pending',
  },
  aiAnalysis: {
    confidence: Number,
    detectedIssues: [String],
    recommendedAction: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RoadDamage', roadDamageSchema);
