import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("Please provide MONGODB_URI in the .env file");
}
if (!process.env.JWT_SECRET) {
  throw new Error("Please provide JWT_SECRET in the .env file");
}
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Please provide GEMINI_API_KEY in the .env file");
}
if (!process.env.CLIENT_URL) {
  throw new Error("Please provide CLIENT_URL in the .env file");
}

export const config = {
  MONGODB_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL,
};
