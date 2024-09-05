import axios from "axios";

//TODO: Find a way to not hardcode the port
const API_URL = `http://localhost:5001/api/conversation`;

export const generateConversation = async (
  theme: string,
  newWords: string[],
  learnedWords: string[]
) => {
  try {
    const response = await axios.post(`${API_URL}/generate`, {
      theme,
      newWords,
      learnedWords,
    });
    return response.data.conversation;
  } catch (error) {
    console.error("Error generating conversation:", error);
    throw error;
  }
};
