const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/authMiddleware");
const {
  registerUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getPostsByUserId,
  createNewPost,
  createFriendsRequest,
  acceptFriendsRequest
} = require("../controllers/userController");

router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUserById);
router.delete("/:id", verifyToken, deleteUserById);

router.get("/:id/posts", verifyToken, getPostsByUserId);
router.post("/:id/posts", verifyToken, createNewPost);

router.post("/:id/friends", verifyToken, createFriendsRequest);
router.patch("/:id/friends/:fid", verifyToken, acceptFriendsRequest);

router.post("/", registerUser);

module.exports = router;
