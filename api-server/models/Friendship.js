const mongoose = require("mongoose");

// Define Friendship Schema
const friendshipSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  friend_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: { type: String, enum: ["pending", "accepted"], default: "pending" },
});

// Create Friendship model
const Friendship = mongoose.model("Friendship", friendshipSchema);

module.exports = Friendship;
