import React, { useState, useEffect } from "react";

interface QuizProps {
  newWords: { id: number; text: string }[];
  updateProgress: (id: number, progress: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ newWords, updateProgress }) => {
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    generateQuestion();
  }, [newWords]);

  const generateQuestion = () => {
    const word = newWords[Math.floor(Math.random() * newWords.length)];
    setCurrentQuestion(`Use the word "${word.text}" in a sentence:`);
  };

  const handleSubmit = () => {
    const usedWord = newWords.find((word) =>
      userAnswer.toLowerCase().includes(word.text.toLowerCase())
    );
    if (usedWord) {
      setFeedback("Correct! Great job using the word.");
      updateProgress(usedWord.id, 20);
    } else {
      setFeedback("Try again. Make sure to use one of the new words.");
    }
    setUserAnswer("");
    generateQuestion();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Practice Quiz
      </h2>
      <p className="mb-4 text-gray-600">{currentQuestion}</p>
      <div className="space-y-4">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here"
          className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
        />
        <button
          onClick={handleSubmit}
          className="w-full px-3 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Submit
        </button>
        {feedback && (
          <p
            className={`mt-2 text-sm ${
              feedback.includes("Correct") ? "text-green-600" : "text-red-600"
            }`}
          >
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
};

export default Quiz;
