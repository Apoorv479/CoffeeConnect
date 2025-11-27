// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Controller functions import kiye
const { registerUser, authUser } = require('../controllers/authController');

// Raste (Routes) banaye
// 1. Agar koi POST /api/auth/register karega -> registerUser chalega
router.post('/register', registerUser);

// 2. Agar koi POST /api/auth/login karega -> authUser chalega
router.post('/login', authUser);

module.exports = router;