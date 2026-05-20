import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";
import { generateInterviewReportController } from "../controllers/interview.controller";
const router = Router();

router.post(
  "/",
  authMiddleware,
  upload.single("resume"),
  generateInterviewReportController,
);

router.get("/:id", authMiddleware, (req, res) => {});

router.post("/submit/:id", authMiddleware, (req, res) => {});

router.delete("/:id", authMiddleware, (req, res) => {});

export default router;
