const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

// REGISTER
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        message: 'Username already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser(username, passwordHash);

    return res.status(201).json({
      message: 'Register successful',
      user: newUser,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({
      message: 'Login successful',
      accessToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  register,
  login,
};
