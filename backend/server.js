// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// parse JSON bodies
app.use(express.json());

// CORS - allow Vercel + Render domains (use CLIENT_URL environment variable)
app.use(cors({
  origin: process.env.CLIENT_URL || '*'
}));

// connect to MongoDB
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
if (!mongoUri) {
  console.error('MONGODB_URI not set in environment variables');
} else {
  mongoose.connect(mongoUri, {
    // modern options not required for latest mongoose, leaving defaults
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message || err);
  });
}

// load routes
const questionRoutes = require('./routes/questions'); // ensure path correct
app.use('/api/questions', questionRoutes);

// optional health / root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// error handler (basic)
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// start server (Render provides PORT in env)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
