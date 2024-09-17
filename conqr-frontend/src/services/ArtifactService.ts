import axios from "axios";

//TODO: Find a way to not hardcode the port
const API_URL = `http://localhost:5001/api/artifacts`;

export interface Artifact {
  _id: string;
  text: string;
  translation: string;
  difficulty: number;
  usageExample: string;
  category: string;
}

export const getArtifacts = async (): Promise<Artifact[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createArtifact = async (
  artifactData: Omit<Artifact, "_id">
): Promise<Artifact> => {
  const response = await axios.post(API_URL, artifactData);
  return response.data;
};

export const updateArtifact = async (
  id: string,
  artifactData: Partial<Artifact>
): Promise<Artifact> => {
  const response = await axios.put(`${API_URL}/${id}`, artifactData);
  return response.data;
};

export const deleteArtifact = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
