// src/routes/assistant.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { sendMessage } = require('../controllers/assistantController');

router.post('/message', verifyToken, sendMessage);

module.exports = router;
