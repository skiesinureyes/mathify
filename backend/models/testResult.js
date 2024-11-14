const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  speed: Number, // Average speed in QPM
  accuracy: Number, // Accuracy in percentage
  rightAnswers: Number,
  wrongAnswers: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', TestResultSchema);
