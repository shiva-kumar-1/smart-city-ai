const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const RoadDamage = require('../models/RoadDamage');
const { protect, adminOnly } = require('../middleware/auth');

// Multer setup
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `damage-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  },
});

// Simulate AI analysis (replace with real ML model integration)
const analyzeImage = (damageType, severity) => {
  const issues = {
    pothole: ['Surface depression detected', 'Water accumulation risk'],
    crack: ['Longitudinal fracture pattern', 'Structural weakness detected'],
    subsidence: ['Ground movement detected', 'Foundation risk identified'],
    flooding: ['Water logging detected', 'Drainage obstruction possible'],
    debris: ['Foreign material on road', 'Obstruction hazard identified'],
    other: ['Anomaly detected on road surface'],
  };
  const actions = {
    low: 'Schedule routine maintenance within 30 days',
    medium: 'Priority repair within 7 days',
    high: 'Urgent repair required within 48 hours',
    critical: 'IMMEDIATE action required — road may be dangerous',
  };
  return {
    confidence: Math.round(72 + Math.random() * 25),
    detectedIssues: issues[damageType] || issues.other,
    recommendedAction: actions[severity] || actions.medium,
  };
};

// GET /api/road-damage - all reports (protected)
router.get('/road-damage', protect, async (req, res) => {
  try {
    const { status, severity, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    // Citizens see only their own reports; admins see all
    if (req.user.role !== 'admin') filter.reportedBy = req.user._id;

    const reports = await RoadDamage.find(filter)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await RoadDamage.countDocuments(filter);
    res.json({ reports, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/road-damage/stats - admin only
router.get('/road-damage/stats', protect, adminOnly, async (req, res) => {
  try {
    const total = await RoadDamage.countDocuments();
    const pending = await RoadDamage.countDocuments({ status: 'pending' });
    const inProgress = await RoadDamage.countDocuments({ status: 'in_progress' });
    const resolved = await RoadDamage.countDocuments({ status: 'resolved' });
    const critical = await RoadDamage.countDocuments({ severity: 'critical' });
    const bySeverity = await RoadDamage.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);
    const byType = await RoadDamage.aggregate([
      { $group: { _id: '$damageType', count: { $sum: 1 } } },
    ]);
    res.json({ total, pending, inProgress, resolved, critical, bySeverity, byType });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/road-damage - submit report (protected)
router.post('/road-damage', protect, upload.single('image'), async (req, res) => {
  try {
    const { location, damageType, severity, description, lat, lng } = req.body;
    if (!location || !damageType || !severity) {
      return res.status(400).json({ error: 'Location, damage type, and severity are required' });
    }

    const aiAnalysis = analyzeImage(damageType, severity);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const report = await RoadDamage.create({
      reportedBy: req.user._id,
      location,
      coordinates: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined,
      damageType,
      severity,
      description,
      imageUrl,
      aiAnalysis,
    });

    await report.populate('reportedBy', 'name email');
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/road-damage/:id/status - admin update status
router.put('/road-damage/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const report = await RoadDamage.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('reportedBy', 'name email');
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
