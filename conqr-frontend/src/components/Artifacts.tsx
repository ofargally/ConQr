import React from "react";

interface Artifact {
  id: string;
  word: string;
}

interface ArtifactsProps {
  artifacts: Artifact[];
}

const Artifacts: React.FC<ArtifactsProps> = ({ artifacts }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Artifacts</h2>
      <div className="grid grid-cols-2 gap-4">
        {artifacts.map((artifact) => (
          <div
            key={artifact.id}
            className="p-3 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200"
          >
            {artifact.word}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Artifacts;
