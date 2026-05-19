import { GoogleGenAI } from "@google/genai";
import { config } from "../config/config";
const genAI = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});

export const askAI = async (prompt: string) => {
  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text;
};
