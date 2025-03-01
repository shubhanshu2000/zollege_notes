import express from "express";
import helmet from "helmet";
import "dotenv/config";
import cors from "cors";
import { dbConnect } from "./config/dbConnect.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";



const server = express();

server.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

server.use(helmet());

const PORT = process.env.PORT || 5001;

server.use(express.json());
server.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Routes
server.use("/api/auth", authRoutes);
server.use("/api/user", userRoutes);
server.use("/api/notes", notesRoutes);

;

server.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

export default server;