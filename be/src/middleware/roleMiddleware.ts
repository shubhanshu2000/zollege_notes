import express, { NextFunction, Response } from "express";
import { CustomRequest } from "../types/index.js";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
       res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export default authorizeRoles;
