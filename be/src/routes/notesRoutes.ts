import express from "express";
import { noteController } from "../controller/notesController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(verifyToken);

router.post("/", noteController.createNote as express.RequestHandler);
router.get("/", noteController.getUserNotes as express.RequestHandler);
router.put("/:id", noteController.updateNote as express.RequestHandler);
router.delete("/:id", noteController.deleteNote as express.RequestHandler);

export default router;
