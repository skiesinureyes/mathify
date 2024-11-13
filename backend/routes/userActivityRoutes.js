const express = require('express');
const { saveUserActivity, getUserActivity } = require('../controllers/userActivityController');
const authMiddleware = require('../middleware/authMiddleware'); // pastikan authMiddleware diimplementasikan

const router = express.Router();

// Route untuk mendapatkan data aktivitas pengguna
router.get('/activity', authMiddleware, getUserActivity);

// Route untuk menyimpan atau memperbarui data aktivitas pengguna
router.post('/activity', authMiddleware, saveUserActivity);

module.exports = router;
