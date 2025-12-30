require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.route');
const pool = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Auth Service is running' });
});

// Routes
app.use('/api/auth', authRoutes);

// Test DB connection
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected successfully');
  } catch (err) {
    console.error('PostgreSQL connection failed', err);
  }
})();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
