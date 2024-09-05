import Artifact, { IArtifact } from "../models/Artifacts";

class ArtifactManager {
  async createArtifact(artifactData: IArtifact): Promise<IArtifact> {
    const artifact = new Artifact(artifactData);
    return await artifact.save();
  }

  async getArtifacts(filter = {}): Promise<IArtifact[]> {
    return await Artifact.find(filter);
  }

  async updateArtifact(
    id: string,
    updateData: Partial<IArtifact>
  ): Promise<IArtifact | null> {
    return await Artifact.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteArtifact(id: string): Promise<IArtifact | null> {
    return await Artifact.findByIdAndDelete(id);
  }
}

export default new ArtifactManager();
