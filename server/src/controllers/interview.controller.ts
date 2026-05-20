import { generateInterviewReport } from "../services/ai.service";
import { interviewReportModel } from "../models/interviewReport.model";
import type { Request, Response } from "express";
import { PDFParse } from "pdf-parse";

const generateInterviewReportController = async (
  req: Request,
  res: Response,
) => {
  // if (!req.file) {
  //   return res.status(400).json({ success: false, message: "Resume file is required" });
  // }

  const resumeContent = await new PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    userId: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    matchScore: interviewReportByAi.matchScore,
    technicalQuestions: interviewReportByAi.technicalQuestions,
    behavioralQuestions: interviewReportByAi.behavioralQuestions,
    skillGaps: interviewReportByAi.skillGaps,
    preparationPlan: interviewReportByAi.preparationPlan,
    title: interviewReportByAi.title,
  });

  return res.status(201).json({
    success: true,
    message: "Interview report generated successfully",
    data: interviewReport,
  });
};

export { generateInterviewReportController };
