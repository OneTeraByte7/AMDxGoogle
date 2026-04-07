// src/routes/logs.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
    getLogsForDate,
    getWeeklyLogs,
    addLog,
    updateLog,
    deleteLog,
} = require('../controllers/logsController');

router.get('/weekly', verifyToken, getWeeklyLogs);
router.get('/:date', verifyToken, getLogsForDate);
router.post('/', verifyToken, addLog);
router.put('/:logId', verifyToken, updateLog);
router.delete('/:logId', verifyToken, deleteLog);

module.exports = router;
