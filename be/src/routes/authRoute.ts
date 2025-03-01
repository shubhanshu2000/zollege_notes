import express from "express";
import { login, register } from "../controller/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login as express.RequestHandler);

export default router;
