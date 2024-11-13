require('dotenv').config();

const express = require('express');
const connectDB = require('./backend/config/db');
const authRoutes = require('./backend/routes/auth');
const mongoose = require('mongoose');
const userRoutes = require('./backend/routes/userRoutes'); // Import user routes
const authMiddleware = require('./backend/middleware/authMiddleware');
const userActivityRoutes = require('./routes/userActivityRoutes');


const router = express.Router();
const app = express();
connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes); 
app.use('/api/auth', userRoutes);
app.use('/api', userActivityRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
