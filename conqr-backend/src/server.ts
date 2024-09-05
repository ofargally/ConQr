import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import conversationRoutes from "./routes/ConversationRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

const PORT = process.env.PORT || 5700;

app.use("/api/conversation", conversationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
