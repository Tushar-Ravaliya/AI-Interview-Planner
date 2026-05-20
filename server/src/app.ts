import express from "express";
import authRoutes from "./routes/auth.route";
import interviewRoutes from "./routes/interview.route";
import cookies from "cookie-parser";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookies());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/interview", interviewRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to AI Interview app");
});

export default app;
