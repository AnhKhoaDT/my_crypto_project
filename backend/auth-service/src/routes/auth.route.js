const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Local auth
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.get("/me", authMiddleware, authController.me);

// Google OAuth (DÙNG STRATEGY)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // user đã được gắn từ passport
    res.json({
      message: "Login with Google successful",
      user: req.user
    });
  }
);

module.exports = router;
