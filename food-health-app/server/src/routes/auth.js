// src/routes/auth.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { upsertProfile, getProfile } = require('../controllers/authController');

router.post('/profile', verifyToken, upsertProfile);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
