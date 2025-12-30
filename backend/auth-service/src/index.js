require("dotenv").config();

const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth.route");
const passport = require("./config/passport");

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;

sequelize
  .sync()
  .then(() => {
    console.log("PostgreSQL connected");
    app.listen(PORT, () => {
      console.log(`Auth service running on port ${PORT}`);
    });
  })
  .catch(console.error);
