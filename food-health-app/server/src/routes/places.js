// src/routes/places.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { getNearbyHealthStores } = require('../controllers/placesController');

router.get('/nearby', verifyToken, getNearbyHealthStores);

module.exports = router;
