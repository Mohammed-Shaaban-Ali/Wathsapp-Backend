const mongoose = require("mongoose");

// USer Schema
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// User model
const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
};
