import Chat from "../models/chat.js";
import User from "../models/user.js";

// ! Post a new chat message
export const postChat = async (req, res) => {
  try {
    const { uid, message, role } = req.body;

    // 🔍 Find user by UID
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const newChat = new Chat({
      userId: user._id, // 🔗 ObjectId reference
      message,
      role,
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ! Get chats by user
export const getChatsByUid = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const chats = await Chat.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .populate("userId"); // ✅ include full user info

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
