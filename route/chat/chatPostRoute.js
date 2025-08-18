import express from "express";
import { getChatsByUid, postChat } from "../../controllers/chatController.js";

const router = express.Router();

router.post("/chat", postChat);

router.get("/chat/:userId", getChatsByUid);

export default router;
