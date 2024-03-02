const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, first_name, last_name });
    const savedUser = await user.save();
    res.status(201).json({ message: "User registered successfully" , result: savedUser});
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error});
  }
};

const getUserById = async (req, res) => {
  try {
    const usesrId = req.params.id;
    const user = await User.findOne({ userId });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed getting user: " + error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedProps = req.body;
    if (req.userId !== userId) {
      res.status(403).json({ error: "Unauthorized request" });
      return;
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId }, 
      updatedProps, 
      { new: true }
    );

    if (!updatedUser) {
      res.status(500).json({message:"User not found"});
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

    if (req.userId !== userId) {
      res.status(403).json({ error: "Unauthorized request" });
      return;
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user exists, delete it
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  getUserById,
  updateUserById,
  deleteUserById
};
