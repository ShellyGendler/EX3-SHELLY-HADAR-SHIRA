const express = require("express");
const router = express.Router();
const verifyToken = require("../auth/authMiddleware");
const { registerUser, getUserById } = require("../controllers/userController");

router.get("/:id",verifyToken, getUserById);

router.post("/", registerUser);

module.exports = router;
