import { Request, Response } from "express";
import ArtifactManager from "../services/ArtifactManager";

class ArtifactController {
  async createArtifact(req: Request, res: Response) {
    try {
      const artifact = await ArtifactManager.createArtifact(req.body);
      res.status(201).json(artifact);
    } catch (error) {
      res.status(400).json({ error: "Error creating artifact" });
    }
  }

  async getArtifacts(req: Request, res: Response) {
    try {
      const artifacts = await ArtifactManager.getArtifacts();
      res.json(artifacts);
    } catch (error) {
      res.status(500).json({ error: "Error fetching artifacts" });
    }
  }

  async updateArtifact(req: Request, res: Response) {
    try {
      const artifact = await ArtifactManager.updateArtifact(
        req.params.id,
        req.body
      );
      if (artifact) {
        res.json(artifact);
      } else {
        res.status(404).json({ error: "Artifact not found" });
      }
    } catch (error) {
      res.status(400).json({ error: "Error updating artifact" });
    }
  }

  async deleteArtifact(req: Request, res: Response) {
    try {
      const artifact = await ArtifactManager.deleteArtifact(req.params.id);
      if (artifact) {
        res.json({ message: "Artifact deleted successfully" });
      } else {
        res.status(404).json({ error: "Artifact not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error deleting artifact" });
    }
  }
}

export default new ArtifactController();
