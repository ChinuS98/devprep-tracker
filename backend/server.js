// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
if (mongoUri) {
  mongoose.connect(mongoUri).then(()=>console.log('MongoDB connected')).catch(err=>console.error('MongoDB error', err.message));
} else {
  console.error('MONGODB_URI not set');
}

// load router
const questionRoutes = require('./routes/questions');    // ensure file exists
app.use('/api/questions', questionRoutes);

// optional root
app.get('/', (req,res) => res.send('API is running'));

// error handler
app.use((err, req, res, next) => { console.error(err); res.status(500).json({error: err.message||'Server error'}); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));
