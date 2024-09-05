import React, { useState, useEffect } from "react";

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
  const [conversation, setConversation] = useState<string[]>([]);

  useEffect(() => {
    const simulateConversation = () => {
      const allWords = [...newWords.map((w) => w.text), ...learnedWords];
      const newConversation = [
        `AI 1: Bonjour! Bienvenue au ${theme}.`,
        `AI 2: Merci! J'adore ce ${theme}.`,
        `AI 1: Oui, c'est ${
          allWords[Math.floor(Math.random() * allWords.length)]
        }.`,
        `AI 2: Absolument! Que voulez-vous ${
          allWords[Math.floor(Math.random() * allWords.length)]
        }?`,
        `AI 1: Je voudrais ${
          allWords[Math.floor(Math.random() * allWords.length)]
        }, s'il vous plaît.`,
      ];
      setConversation(newConversation);
    };

    simulateConversation();
  }, [theme, newWords, learnedWords]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Conversation: {theme}
      </h2>
      <div className="space-y-2">
        {conversation.map((line, index) => (
          <p
            key={index}
            className={`p-2 rounded ${
              index % 2 === 0
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Conversation;
