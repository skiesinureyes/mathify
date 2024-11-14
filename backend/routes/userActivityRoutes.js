// routes/userActivityRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Assumes you have JWT auth middleware
const UserActivity = require('../models/userActivity'); // Assumes a user activity model

// Route to save test results
router.post('/saveTestResult', authMiddleware, async (req, res) => {
    const { speed, accuracy, rightAnswers, wrongAnswers } = req.body;

    try {
        // Save the test result associated with the user
        const testResult = new UserActivity({
            userId: req.user.userId, // Extracted from auth middleware
            speed,
            accuracy,
            rightAnswers,
            wrongAnswers,
            date: new Date()
        });
        
        await testResult.save();
        res.status(201).json({ message: 'Test result saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// routes/userActivityRoutes.js
router.get('/getTestResults', authMiddleware, async (req, res) => {
    try {
        const results = await UserActivity.find({ userId: req.user.userId });
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
