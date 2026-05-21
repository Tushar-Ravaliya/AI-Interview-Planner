import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";
import {
  generateInterviewReportController,
  getInterviewReportByIdController,
} from "../controllers/interview.controller";
const router = Router();

router.post(
  "/",
  authMiddleware,
  upload.single("resume"),
  generateInterviewReportController,
);

router.get("/:id", authMiddleware, getInterviewReportByIdController);

router.post("/submit/:id", authMiddleware, (req, res) => {});

router.delete("/:id", authMiddleware, (req, res) => {});

export default router;
