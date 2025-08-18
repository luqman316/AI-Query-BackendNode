import express from "express";
import Chat from "../models/chat.js";
import User from "../models/user.js";

const router = express.Router();

// Get all chat messages for a user
router.get("/chat/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find user by uid
    const user = await User.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Find all chats for this user
    const chats = await Chat.find({ userId: user._id }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create a chat message for a user
router.post("/chat", async (req, res) => {
  try {
    const { uid, message, role } = req.body;
    const existingUser = await User.findOne({ uid });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const newChat = new Chat({
      userId: existingUser._id,
      message,
      role,
    });
    await newChat.save();
    res
      .status(201)
      .json({ message: "Chat created successfully", chat: newChat });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create or update a user
router.post("/user", async (req, res) => {
  try {
    const {
      uid,
      firstName,
      lastName,
      email,
      profilePictureUrl,
      emailVerified,
      createdAt,
      updatedAt,
      lastSignInAt,
    } = req.body;

    let existingUser = await User.findOne({ uid });
    if (existingUser) {
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.email = email;
      existingUser.profilePictureUrl = profilePictureUrl;
      existingUser.emailVerified = emailVerified;
      existingUser.updatedAt = updatedAt || new Date();
      existingUser.lastSignInAt = lastSignInAt || new Date();
      await existingUser.save();
      return res
        .status(200)
        .json({ message: "User updated successfully", user: existingUser });
    }

    const newUser = new User({
      uid,
      firstName,
      lastName,
      email,
      profilePictureUrl,
      emailVerified,
      createdAt: createdAt || new Date(),
      updatedAt: updatedAt || new Date(),
      lastSignInAt: lastSignInAt || new Date(),
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
