import { Response } from "express";
import { Note } from "../models/noteModel.js";
import { CustomRequest } from "../types/index.js";

export const noteController = {
  // Create a new note
  async createNote(req: CustomRequest, res: Response) {
    try {
      const { title, content, category } = req.body;

      const note = new Note({
        title,
        content,
        category,
        userId: req.user!.id,
      });

      await note.save();
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ message: "Error creating note" });
    }
  },

  // Get all notes for the logged-in user
  async getUserNotes(req: CustomRequest, res: Response) {
    try {
      const notes = await Note.find({ userId: req.user!.id }).sort({
        createdAt: -1,
      });
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notes" });
    }
  },

  // Update a note
  async updateNote(req: CustomRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, content, category } = req.body;

      const note = await Note.findOne({
        _id: id,
        userId: req.user!.id,
      });

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      note.title = title;
      note.content = content;
      note.category = category;
      await note.save();

      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Error updating note" });
    }
  },

  // Delete a note
  async deleteNote(req: CustomRequest, res: Response) {
    try {
      const { id } = req.params;

      const note = await Note.findOneAndDelete({
        _id: id,
        userId: req.user!.id,
      });

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting note" });
    }
  },
};
