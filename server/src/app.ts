import express from "express";
import authRoutes from "./routes/auth.route";
import cookies from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookies());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to chat app");
});

export default app;
