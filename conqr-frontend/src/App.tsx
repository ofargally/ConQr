import React, { useState } from "react";
import Conversation from "./components/Conversation";
import Artifacts from "./components/Artifacts";

interface Artifact {
  id: string;
  word: string;
}

const App: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  const handleArtifactSelect = (word: string) => {
    if (!artifacts.some((artifact) => artifact.word === word)) {
      setArtifacts([...artifacts, { id: Date.now().toString(), word }]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        ConQr Language Learning
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <Conversation
            theme="At the Restaurant"
            newWords={["menu", "commander"]}
            learnedWords={["bonjour", "merci"]}
            onArtifactSelect={handleArtifactSelect}
          />
        </div>
        <div className="w-full md:w-1/3">
          <Artifacts artifacts={artifacts} />
        </div>
      </div>
    </div>
  );
};

export default App;
