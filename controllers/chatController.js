import Chat from "../models/chat.js";
import User from "../models/user.js";

// ! Post a new chat message
// export const postChat = async (req, res) => {
//   try {
//     const { userId, message } = req.body;
//     if (!userId || !message)
//       return res.status(400).json({ error: "Missing fields" });

//     const newChat = new Chat({ userId, message });
//     await newChat.save();

//     res.status(201).json(newChat);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
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
// export const getChatsByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const chats = await Chat.find({ userId }).sort({ timestamp: -1 });

//     res.status(200).json(chats);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
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

// // ! Post a new chat message
// export const postChat = async (req, res) => {
//   try {
//     const {
//       userId,
//       userEmail,
//       userName,
//       organizationId,
//       messages,
//       sessionId,
//       title,
//     } = req.body;

//     if (!userId || !userEmail || !messages || !Array.isArray(messages)) {
//       return res.status(400).json({
//         error: "Missing required fields: userId, userEmail, messages",
//       });
//     }

//     const chatSessionId =
//       sessionId ||
//       `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

//     // Check if chat session already exists
//     let chatSession = await Chat.findOne({ sessionId: chatSessionId });

//     if (chatSession) {
//       // Add new messages to existing session
//       chatSession.messages.push(...messages);
//       await chatSession.save();

//       res.json({
//         success: true,
//         sessionId: chatSessionId,
//         message: "Messages added to existing chat",
//         chat: chatSession,
//       });
//     } else {
//       // Create new chat session
//       const newChat = new Chat({
//         userId,
//         userEmail,
//         userName: userName || "Anonymous User",
//         organizationId: organizationId || "default-org",
//         sessionId: chatSessionId,
//         messages,
//         title:
//           title || messages[0]?.content?.slice(0, 50) + "..." || "New Chat",
//         metadata: {
//           model: "openai/gpt-3.5-turbo",
//           tokenCount: 0,
//           responseTime: 0,
//         },
//       });

//       const savedChat = await newChat.save();

//       res.json({
//         success: true,
//         sessionId: chatSessionId,
//         message: "New chat created successfully",
//         chat: savedChat,
//       });
//     }
//   } catch (error) {
//     console.error("Post chat error:", error);
//     res.status(500).json({
//       error: "Failed to save chat",
//       details: error.message,
//     });
//   }
// };

// // ! Get chats by user
// export const getChatsByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const {
//       limit = 20,
//       page = 1,
//       sortBy = "createdAt",
//       order = "desc",
//     } = req.query;

//     if (!userId) {
//       return res.status(400).json({
//         error: "User ID is required",
//       });
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const sortOrder = order === "asc" ? 1 : -1;

//     const chats = await Chat.find({ userId })
//       .sort({ [sortBy]: sortOrder })
//       .limit(parseInt(limit))
//       .skip(skip)
//       .select("sessionId title createdAt updatedAt messages metadata isActive");

//     const total = await Chat.countDocuments({ userId });

//     res.json({
//       success: true,
//       chats,
//       pagination: {
//         total,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages: Math.ceil(total / parseInt(limit)),
//       },
//     });
//   } catch (error) {
//     console.error("Get chats error:", error);
//     res.status(500).json({
//       error: "Failed to fetch chats",
//       details: error.message,
//     });
//   }
// };
