//This is the schema for the artifacts that are used in the conversation
//for each artifact, there should be a user-specific score for experience points with
//the artifact, which could be used for a more personalized and adaptive learning experience.

import mongoose, { Document, Schema } from "mongoose";

export interface IArtifact extends Document {
  text: string;
  translation: string;
  difficulty: number;
  usageExample: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  experiencePoints: number;
}

const ArtifactSchema: Schema = new Schema({
  text: { type: String, required: true, unique: true },
  translation: { type: String, required: true },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  usageExample: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  experiencePoints: { type: Number, default: 0 },
});

export default mongoose.model<IArtifact>("Artifact", ArtifactSchema);
