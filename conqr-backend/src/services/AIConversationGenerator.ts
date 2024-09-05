//Could later be used for a more complex conversation generator
//With different models and more sophisticated prompts, prompt-flows
//and use of Special Agents with specific tools and capabilities.
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

class AIConversationGenerator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateConversation(
    theme: string,
    newWords: string[],
    learnedWords: string[]
  ): Promise<string> {
    const prompt = `Generate a short conversation between two people about "${theme}". 
    Include the following new words: ${newWords.join(", ")}. 
    You can also use these learned words: ${learnedWords.join(", ")}.
    The conversation should be natural and help demonstrate the usage of the new words.`;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content || "";
  }
}

export default new AIConversationGenerator();
