// src/routes/auth.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { upsertProfile, getProfile, getSummary } = require('../controllers/authController');

router.post('/profile', verifyToken, upsertProfile);
router.get('/profile', verifyToken, getProfile);
router.get('/summary', verifyToken, getSummary);

module.exports = router;
