const mongoose = require("mongoose");

const CommentSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  }
});

const PostSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  likes_count: { type: Number, default: 0 },
  comments: [CommentSchema]
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
