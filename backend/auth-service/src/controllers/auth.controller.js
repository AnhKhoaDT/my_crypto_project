const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword
    });

    res.status(201).json({
      id: user.id,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: "Register failed" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    await RefreshToken.create({
      token: refreshToken,
      userId: user.id
    });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    const stored = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!stored) return res.sendStatus(403);

    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ accessToken: newAccessToken });
  } catch {
    res.sendStatus(403);
  }
};

const me = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ["id", "username"]
  });
  res.json(user);
};

module.exports = {
  register,
  login,
  refresh,
  me
};
