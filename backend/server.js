// server.js (or index.js)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

async function start() {
  try {
    // Mongoose 6+ no longer needs useNewUrlParser/useUnifiedTopology options,
    // but you can still pass modern options if you want (example below).
    await mongoose.connect(mongoUri, {
      // Optional modern options you can include if you need:
      // serverSelectionTimeoutMS: 5000,
      // family: 4 // use IPv4, sometimes helpful in some networks
    });

    console.log('✅ MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

start();

// your routes here...
