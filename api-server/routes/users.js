const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/authMiddleware");
const {
  registerUser,
  getUserById,
  updateUserById,
  deleteUserById
} = require("../controllers/userController");

router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUserById);
router.delete("/:id", verifyToken, deleteUserById);

// router.get("/:id/posts", verifyToken, deleteUserById);
// router.post("/:id/posts", verifyToken, deleteUserById);

router.post("/", registerUser);

module.exports = router;
