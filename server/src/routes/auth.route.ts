import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controller.ts";

const router = Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

export default router;
