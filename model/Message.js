const mongoose = require("mongoose");

// USer Schema
const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// User model
const User = mongoose.model("Message", MessageSchema);

module.exports = {
  Message,
};
