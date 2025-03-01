import mongoose from "mongoose";

let cachedConnection: typeof mongoose | null = null;

export const dbConnect = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(
      process.env.MONGO_CONNECTION as string,
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      }
    );
    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};
