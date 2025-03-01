import express from "express";
import { noteController } from "../controller/notesController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(verifyToken);

router.post("/", noteController.createNote);
router.get("/", noteController.getUserNotes);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

export default router;
