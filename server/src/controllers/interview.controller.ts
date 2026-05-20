import { generateInterviewReport } from "../services/ai.service";
import { interviewReportModel } from "../models/interviewReport.model";
import type { Request, Response } from "express";
import { PDFParse } from "pdf-parse";

const generateInterviewReportController = async (
  req: Request,
  res: Response,
) => {
  const resumeContent = await new PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescrption, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport(
    resumeContent.text,
    selfDescrption,
    jobDescription,
  );

  const interiewReport = await interviewReportModel.create({
    userId: req.user.id,
    resume: resumeContent,
    selfDescrption,
    jobDescription,
    ...interviewReportByAi,
  });

  return res.status(201).json({
    success: true,
    message: "Interview report generated successfully",
    data: interiewReport,
  });
};

export { generateInterviewReportController };
