const mongoose = require("mongoose");

// USer Schema
const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

// User model
const User = mongoose.model("Conversation", ConversationSchema);

module.exports = {
  Conversation,
};
