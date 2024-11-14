const testResult = require('../models/testResult');

// Save Test Result
exports.saveTestResult = async (req, res) => {
  try {
    const { speed, accuracy, rightAnswers, wrongAnswers } = req.body;
    const userId = req.user._id; // Assuming you have user authentication and `req.user` holds the user's info

    const newResult = new TestResult({
      userId,
      speed,
      accuracy,
      rightAnswers,
      wrongAnswers
    });

    await newResult.save();
    res.status(201).json({ message: 'Test result saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Test Results for a User
exports.getTestResults = async (req, res) => {
  try {
    const userId = req.user._id;
    const results = await testResult.find({ userId }).sort({ date: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
