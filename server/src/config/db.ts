import mongoose from "mongoose";
import { config } from "./config";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error: any) {
    console.log(error.message);
    process.exit(1);
  }
};
