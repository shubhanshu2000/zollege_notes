import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { CustomRequest } from "../types/index.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { userController } from "../controller/userController.js";

const router = express.Router();

router.get(
  "/admin",
  verifyToken,
  authorizeRoles("admin"),
  (req: CustomRequest, res) => {
    res.json({ message: "Admin" });
  }
);

router.get(
  "/user",
  verifyToken,
  authorizeRoles("admin", "user"),
  (req: CustomRequest, res) => {
    res.json({ message: "User" });
  }
);

router.put("/profile", verifyToken, userController.updateProfile);

export default router;
