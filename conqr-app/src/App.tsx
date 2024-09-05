

import React, { useState } from "react";
import ArtifactWords from "./components/ArtifactWords";
import LearnedWords from "./components/LearnedWords";
import Conversation from "./components/Conversation";
import Quiz from "./components/Quiz";

interface Word {
  id: number;
  text: string;
  progress: number;
}

const App: React.FC = () => {
  const [newWords, setNewWords] = useState<Word[]>([
    { id: 1, text: "bonjour", progress: 0 },
    { id: 2, text: "merci", progress: 0 },
    { id: 3, text: "au revoir", progress: 0 },
    { id: 4, text: "s'il vous plaît", progress: 0 },
    { id: 5, text: "excusez-moi", progress: 0 },
  ]);

  const [learnedWords, setLearnedWords] = useState<string[]>([
    "je",
    "tu",
    "il",
    "elle",
    "nous",
    "vous",
    "ils",
    "elles",
    "être",
    "avoir",
    "aller",
    "faire",
    "dire",
    "voir",
    "savoir",
  ]);

  const [theme, setTheme] = useState<string>("At a café");

  const updateWordProgress = (id: number, progress: number) => {
    setNewWords(
      newWords.map((word) =>
        word.id === id
          ? { ...word, progress: Math.min(100, word.progress + progress) }
          : word
      )
    );
  };

  return (
    <div>
      <div>
        <div></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-4xl font-bold mb-5 text-center text-gray-800">
            ConQr Language Learning
          </h1>
          <div className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ArtifactWords
                  words={newWords}
                  updateProgress={updateWordProgress}
                />
                <LearnedWords words={learnedWords} />
              </div>
              <div className="space-y-6">
                <Conversation
                  theme={theme}
                  newWords={newWords}
                  learnedWords={learnedWords}
                />
                <Quiz newWords={newWords} updateProgress={updateWordProgress} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
