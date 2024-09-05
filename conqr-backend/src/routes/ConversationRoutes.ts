import express from "express";
import ConversationController from "../controllers/ConversationController";

const router = express.Router();

router.post("/generate", ConversationController.generateConversation);

export default router;
