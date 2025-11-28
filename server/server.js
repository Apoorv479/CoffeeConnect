// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();
connectDB();

const app = express();

// --- MIDDLEWARES (Sabse Zaroori Hissa) ---

// 1. CORS allow karo
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// 2. JSON Parser (YE LINE MISSING YA GALAT JAGAH THI)
// Is line ko Routes se upar hona zaroori hai!
app.use(express.json()); 

// ----------------------------------------

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});