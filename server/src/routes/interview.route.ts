import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";
import {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  deleteInterviewReportController,
} from "../controllers/interview.controller";
const router = Router();

router.post(
  "/",
  authMiddleware,
  upload.single("resume"),
  generateInterviewReportController,
);

router.get("/", authMiddleware, getAllInterviewReportsController);

router.get("/:id", authMiddleware, getInterviewReportByIdController);

router.delete("/:id", authMiddleware, deleteInterviewReportController);

export default router;
