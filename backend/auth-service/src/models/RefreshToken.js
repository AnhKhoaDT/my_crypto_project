const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "refresh_tokens"
  }
);

RefreshToken.belongsTo(User, { foreignKey: "userId" });
User.hasMany(RefreshToken, { foreignKey: "userId" });

module.exports = RefreshToken;
