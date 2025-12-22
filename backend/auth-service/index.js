require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASS || 'password123',
  database: process.env.DB_NAME || 'crypto_db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432
});

async function initDb() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`);
}

async function waitForDb(retries = 10, delay = 3000) {
  while (retries > 0) {
    try {
      await initDb();
      console.log('DB connected and initialized');
      return;
    } catch (err) {
      retries--;
      console.log(`DB not ready, retrying in ${delay / 1000}s... (${retries} retries left)`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error('DB connection failed after retries');
  process.exit(1);
}

waitForDb();

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at', [username, hash]);
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Username already exists' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  try {
    const result = await pool.query('SELECT id, username, password_hash FROM users WHERE username=$1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Unauthorized' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, created_at FROM users WHERE id=$1', [req.user.userId]);
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));

//api login
app.post('/api/auth/refresh', (req, res) => {
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const newToken = jwt.sign(
      { userId: payload.userId, username: payload.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token: newToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

//api oauth google
app.post('/api/auth/google', async (req, res) => {
  const { googleToken } = req.body || {};

  if (!googleToken) {
    return res.status(400).json({ error: 'Missing googleToken' });
  }

  const user = {
    userId: 999,
    username: 'google_user'
  };

  const token = jwt.sign(
    {
      userId: user.userId,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({
    token,
    user: {
      id: user.userId,
      username: user.username
    }
  });
});
