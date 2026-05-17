import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("Please provide MONGODB_URI in the .env file");
}
if (!process.env.JWT_SECRET) {
  throw new Error("Please provide JWT_SECRET in the .env file");
}

export const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
};
