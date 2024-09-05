import { Request, Response } from "express";
import AIConversationGenerator from "../services/AIConversationGenerator";

class ConversationController {
  async generateConversation(req: Request, res: Response) {
    try {
      const { theme, newWords, learnedWords } = req.body;
      const conversation = await AIConversationGenerator.generateConversation(
        theme,
        newWords,
        learnedWords
      );
      res.json({ conversation });
    } catch (error) {
      res.status(500).json({ error: "Error generating conversation" });
    }
  }
}

export default new ConversationController();
