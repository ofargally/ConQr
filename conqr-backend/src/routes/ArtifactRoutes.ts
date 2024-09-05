import express from "express";
import ArtifactController from "../controllers/ArtifactController";

const router = express.Router();

router.post("/", ArtifactController.createArtifact);
router.get("/", ArtifactController.getArtifacts);
router.put("/:id", ArtifactController.updateArtifact);
router.delete("/:id", ArtifactController.deleteArtifact);

export default router;
