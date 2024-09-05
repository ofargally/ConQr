import React, { useState, useEffect } from "react";
import { Artifact, getArtifacts } from "../services/ArtifactService";

const ArtifactWords: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const fetchedArtifacts = await getArtifacts();
        setArtifacts(fetchedArtifacts);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch artifacts: ${err}`);
        setLoading(false);
      }
    };

    fetchArtifacts();
  }, []);

  if (loading) return <div>Loading artifacts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Artifacts to Learn
      </h2>
      <div className="space-y-4">
        {artifacts.map((artifact) => (
          <div key={artifact._id} className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700">
              {artifact.text}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {artifact.translation}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Difficulty: {artifact.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtifactWords;
