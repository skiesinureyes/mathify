const express = require('express');
const { saveTestResult, getTestResults } = require('../controllers/testResultController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure the user is authenticated

const router = express.Router();

router.post('/save', authMiddleware, saveTestResult);
router.get('/all', authMiddleware, getTestResults);

module.exports = router;
