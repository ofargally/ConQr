import React from "react";

interface LearnedWordsProps {
  words: string[];
}

const LearnedWords: React.FC<LearnedWordsProps> = ({ words }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Learned Words
      </h2>
      <div className="flex flex-wrap gap-2">
        {words.map((word, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LearnedWords;
