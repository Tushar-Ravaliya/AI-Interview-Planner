import express from "express";
import authRoutes from "./routes/auth.route";
import cookies from "cookie-parser";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookies());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to chat app");
});

export default app;
