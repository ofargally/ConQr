import React, { useState, useEffect } from "react";
import { generateConversation } from "../services/ConversationService";

interface ConversationProps {
  theme: string;
  newWords: { text: string }[];
  learnedWords: string[];
}

const Conversation: React.FC<ConversationProps> = ({
  theme,
  newWords,
  learnedWords,
}) => {
  const [conversation, setConversation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      setLoading(true);
      setError(null);
      try {
        const newWordsText = newWords.map((word) => word.text);
        const generatedConversation = await generateConversation(
          theme,
          newWordsText,
          learnedWords
        );
        setConversation(generatedConversation);
      } catch (err) {
        setError(
          `Failed to generate conversation: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [theme, newWords, learnedWords]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Conversation: {theme}
      </h2>
      {loading && <p className="text-gray-600">Loading conversation...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="whitespace-pre-wrap text-gray-700">{conversation}</div>
      )}
    </div>
  );
};

export default Conversation;
