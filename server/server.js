// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); // <-- NEW IMPORT

dotenv.config();
connectDB();

const app = express();

// --- CORS CONFIGURATION (Dynamic) ---
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
  origin: allowedOrigin, 
  credentials: true
}));

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes); // <-- NEW CONNECTION

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});