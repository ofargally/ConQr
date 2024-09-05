import React from "react";

interface Word {
  id: number;
  text: string;
  progress: number;
}

interface ArtifactWordsProps {
  words: Word[];
  updateProgress: (id: number, progress: number) => void;
}

const ArtifactWords: React.FC<ArtifactWordsProps> = ({
  words,
  updateProgress,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        New Words to Learn
      </h2>
      <div className="space-y-4">
        {words.map((word) => (
          <div key={word.id} className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700">
              {word.text}
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${word.progress}%` }}
                ></div>
              </div>
              <button
                onClick={() => updateProgress(word.id, 10)}
                className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Use
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtifactWords;
