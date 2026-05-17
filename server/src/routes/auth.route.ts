import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  getMe,
} from "../controllers/auth.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";

const router = Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/signout", signOut);

router.get("/me", authMiddleware, getMe);

export default router;
