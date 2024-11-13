const UserActivity = require('../models/userActivity');

exports.saveUserActivity = async (req, res) => {
  try {
    const { progress, simulationResults, additionalInfo } = req.body;

    // Cek apakah data aktivitas sudah ada untuk pengguna ini
    let activity = await UserActivity.findOne({ userId: req.user.userId });

    if (activity) {
      // Jika sudah ada, update data
      activity.progress = progress || activity.progress;
      activity.simulationResults = simulationResults || activity.simulationResults;
      activity.additionalInfo = additionalInfo || activity.additionalInfo;
      await activity.save();
    } else {
      // Jika belum ada, buat data aktivitas baru
      activity = new UserActivity({
        userId: req.user.userId,
        progress,
        simulationResults,
        additionalInfo,
      });
      await activity.save();
    }

    res.status(200).json({ message: 'User activity saved successfully', activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fungsi untuk mengambil data aktivitas pengguna
exports.getUserActivity = async (req, res) => {
  try {
    const activity = await UserActivity.findOne({ userId: req.user.userId });
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
