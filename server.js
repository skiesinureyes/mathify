require('dotenv').config();

const express = require('express');
const connectDB = require('./backend/config/db');
const authRoutes = require('./backend/routes/auth');
const mongoose = require('mongoose');
const userRoutes = require('./backend/routes/userRoutes'); // Import user routes
const authMiddleware = require('./backend/middleware/authMiddleware');
const userActivityRoutes = require('./backend/routes/userActivityRoutes');

const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));


// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/auth', userRoutes);
app.use('/api/user-activity', userActivityRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Run the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
