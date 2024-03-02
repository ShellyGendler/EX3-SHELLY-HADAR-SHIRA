const Friendship = require("../models/Friendship");
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;
    const dbUser = await User.findOne({ email });
    if (dbUser) {
      res.status(403).json({ message: "User already exist" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });
    const savedUser = await user.save();
    res
      .status(201)
      .json({ message: "User registered successfully", result: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });
    const friendship = await Friendship.findOne({
      $or: [
        { user_id: userId, friend_id: req.currentUserId },
        { user_id: req.currentUserId, friend_id: userId },
      ],
    });
    res.status(201).json({ user, friendshipStatus: friendship });
  } catch (error) {
    res.status(500).json({ error: "Failed getting user: " + error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedProps = req.body;
    if (req.currentUserId !== userId) {
      res.status(403).json({ error: "Unauthorized request" });
      return;
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updatedProps,
      { new: true }
    );

    if (!updatedUser) {
      res.status(500).json({ message: "User not found" });
    }

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed getting user: " + error.message });
  }
};

const deleteUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (req.currentUserId !== userId) {
      res.status(403).json({ error: "Unauthorized request" });
      return;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const isFriends = async (user1, user2) => {
      const friendship = await Friendship.findOne({
        $or: [
          { user_id: user1, friend_id: user2 },
          { user_id: user2, friend_id: user1 },
        ],
        status: "accepted",
      });
      return !!friendship;
    };
    if (
      userId === req.currentUserId ||
      (await isFriends(req.currentUserId, userId))
    ) {
      const posts = await Post.find({ user_id: userId }).sort({ created_at: -1 });
      res.status(200).json(posts);
    } else {
      res.status(403).json({ message: "Can't access user's posts" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed getting user: " + error.message });
  }
};

const createFriendsRequest = async (req, res) => {
  try {
    const friendship = new Friendship({
      user_id: req.currentUserId,
      friend_id: req.params.id,
    });
    const result = await friendship.save();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed sending request", error: error.message });
  }
};

const acceptFriendsRequest = async (req, res) => {
  try {
    if (req.currentUserId !== req.params.id) {
      res.status(403).json({ error: "Unauthorized request" });
      return;
    }
    const friendship = await Friendship.findOneAndUpdate(
      { user_id: req.params.fid, friend_id: req.params.id, status: "pending" },
      { status: "accepted" },
      { new: true }
    );
    res.status(200).json(friendship);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed sending request", error: error.message });
  }
};

module.exports = {
  registerUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getPostsByUserId,
  createFriendsRequest,
  acceptFriendsRequest
};
