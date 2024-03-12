const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
    },
});

const PostSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    author_image: { type: String, required: true },
    author_name: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    content: { type: String, required: true },
    description: { type: String },
    post_image_url: { type: String },
    title: { type: String, required: true },
    label: { type: String },
    likes_count: { type: Number, default: 0 },
    share_count: { type: Number, default: 0 },
    comments: [CommentSchema],
    // is_liked: { type: Boolean, default: false}, TODO
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
