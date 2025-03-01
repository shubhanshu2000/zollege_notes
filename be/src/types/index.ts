import { Request } from "express";

export interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
