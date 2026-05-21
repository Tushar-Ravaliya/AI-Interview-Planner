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

const getInterviewReportByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const report = await interviewReportModel.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Interview report not found" });
    }

    if (report.userId?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access to report" });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error fetching interview report:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { generateInterviewReportController, getInterviewReportByIdController };
