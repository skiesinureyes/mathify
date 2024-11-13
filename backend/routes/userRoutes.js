const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

// Rute untuk membuat pengguna baru
router.post('/users', createUser);

// Rute untuk mendapatkan semua pengguna
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Rute untuk mendapatkan pengguna berdasarkan ID
router.get('/users/:id', getUserById);

// Rute untuk memperbarui data pengguna
router.put('/users/:id', updateUser);

// Rute untuk menghapus pengguna
router.delete('/users/:id', deleteUser);

module.exports = router;
