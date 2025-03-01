import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION as string);
  } catch (err) {
    console.error(err);
  }
};
