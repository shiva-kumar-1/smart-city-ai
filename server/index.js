require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Route imports
const authRouter = require('./routes/auth');
const parkingRouter = require('./routes/parking');
const trafficRouter = require('./routes/traffic');
const fuelStationsRouter = require('./routes/fuelstations');
const dashboardRouter = require('./routes/dashboard');
const roadDamageRouter = require('./routes/roadDamage');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://smart-city-ai-five.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api', parkingRouter);
app.use('/api', trafficRouter);
app.use('/api', fuelStationsRouter);
app.use('/api', dashboardRouter);
app.use('/api', roadDamageRouter);

// Health check
app.get('/api/healthz', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// 404 handler
app.use('/api', (req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 SmartCity API running on http://localhost:${PORT}`);
});
