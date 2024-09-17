import React, { useState, useEffect, useCallback } from "react";
import { generateConversation } from "../services/ConversationService";

interface ConversationProps {
  theme: string;
  newWords: string[];
  learnedWords: string[];
  onArtifactSelect: (word: string) => void;
}

const Conversation: React.FC<ConversationProps> = ({
  theme,
  newWords,
  learnedWords,
  onArtifactSelect,
}) => {
  const [conversation, setConversation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedConversation = await generateConversation(
        theme,
        newWords,
        learnedWords
      );
      setConversation(generatedConversation);
    } catch (err) {
      setError(`Failed to generate conversation. Please try again. ${err}`);
    } finally {
      setLoading(false);
    }
  }, [theme, newWords, learnedWords]);


  useEffect(() => {
    fetchConversation();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleWordClick = (word: string) => {
    onArtifactSelect(word.replace(/[.,!?]/g, "").toLowerCase());
  };

  const renderConversation = () => {
    return conversation.split("\n").map((line, index) => {
      const [speaker, ...rest] = line.split(":");
      const text = rest.join(":").trim();
      return (
        <div
          key={index}
          className={`mb-4 ${index % 2 === 0 ? "text-left" : "text-right"}`}
        >
          <span className="font-bold">{speaker}:</span>
          <p>
            {text.split(" ").map((word, wordIndex) => (
              <span
                key={wordIndex}
                onClick={() => handleWordClick(word)}
                className="cursor-pointer hover:bg-yellow-200 transition-colors duration-200"
              >
                {word}{" "}
              </span>
            ))}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Conversation: {theme}
      </h2>
      {loading && <p className="text-gray-600">Loading conversation...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="whitespace-pre-wrap text-gray-700">
          {renderConversation()}
        </div>
      )}
      <button
        onClick={fetchConversation}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Regenerate Conversation
      </button>
    </div>
  );
};

export default Conversation;
