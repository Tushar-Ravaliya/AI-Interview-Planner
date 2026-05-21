import express from "express";
import authRoutes from "./routes/auth.route";
import interviewRoutes from "./routes/interview.route";
import cookies from "cookie-parser";
import cors from "cors";
import { config } from "./config/config";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [config.CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);
app.use(cookies());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/interview", interviewRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
