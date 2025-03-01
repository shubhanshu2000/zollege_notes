import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role,
    });
    try {
      const user = await newUser.save();

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res
        .status(201)
        .json({
          message: `User registered with username ${username}`,
          token,
          username,
        });
    } catch (saveError) {
      console.error("Save error:", saveError);
      throw saveError;
    }
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(username, password, "hi");

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with username ${username} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: `Invalid Password` });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, username });
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};
