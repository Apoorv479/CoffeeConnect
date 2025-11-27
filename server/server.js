// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes import kiye
const authRoutes = require('./routes/authRoutes');

dotenv.config();

// Database Connect
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // JSON data allow kiya

// --- ROUTES ---
// Agar URL '/api/auth' se shuru ho, to authRoutes file mein bhejo
app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});