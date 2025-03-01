// backend/controllers/userController.ts
import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const userController = {
  async updateProfile(req: Request, res: Response) {
    try {
      const { username, email, currentPassword, newPassword } = req.body;
      const userId = req.user!.id;

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Update user fields
      if (username) user.username = username;
      if (email) user.email = email;

      // Update password if new password is provided
      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
      }

      await user.save();

      // Return user data without password
      const userData = {
        username: user.username,
        email: user.email,
      };

      res.json(userData);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  },
};
