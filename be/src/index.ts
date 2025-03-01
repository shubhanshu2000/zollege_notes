import express from "express";
import helmet from "helmet";
import "dotenv/config";
import cors from "cors";
import { dbConnect } from "./config/dbConnect.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

dbConnect();

const server = express();

server.use(helmet());

const PORT = process.env.PORT || 5001;

server.use(express.json());
server.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

//Routes
server.use("/api/auth", authRoutes);
server.use("/api/user", userRoutes);
server.use("/api/notes", notesRoutes);

server.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

export default server;