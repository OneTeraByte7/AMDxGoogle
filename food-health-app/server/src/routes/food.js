// src/routes/food.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { searchFood } = require('../controllers/foodController');

router.get('/search', verifyToken, searchFood);

module.exports = router;
