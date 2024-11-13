const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referensi ke model User
    required: true,
  },
  progress: {
    type: String, // Misalnya "25%" atau "50%"
    default: '0%',
  },
  simulationResults: {
    type: Number, // Nilai simulasi atau hasil ujian
    default: 0,
  },
  additionalInfo: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserActivity', UserActivitySchema);
