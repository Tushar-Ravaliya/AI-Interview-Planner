import { GoogleGenAI } from "@google/genai";
import { config } from "../config/config";
import z from "zod";

import zodToJsonSchema from "zod-to-json-schema";

const genAI = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});

const interviewReportSchema = z.object({
  mathScore: z.number().describe("math score of the candidate out of 100"),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("technical questions can be asked in interview"),
        intension: z
          .string()
          .describe("intenstion of interviewer to ask that question"),
        answers: z
          .string()
          .describe(
            "How to answer to this question, what points to cover while answering",
          ),
      }),
    )
    .describe("technical questions can be asked in interview based on resume"),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("behavioral questions can be asked in interview"),
        intension: z
          .string()
          .describe("intenstion of interviewer to ask that question"),
        answers: z
          .string()
          .describe(
            "How to answer to this question, what points to cover while answering",
          ),
      }),
    )
    .describe(
      "behavioral questions can be asked in interview based on resume and self description",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "skills which candidate is lacking according to job description",
          ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("severity of the skill gap"),
      }),
    )
    .describe(
      "skills which candidate is lacking according to job description and resume",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("day of the week"),
        focus: z
          .string()
          .describe(
            "what to study and prepare on this day based on skill gaps",
          ),
        tasks: z.array(z.string()).describe("list of task to be done in a day"),
      }),
    )
    .describe(
      "a day wise preparation plan for the candidate to prepare for the interview based on skill gaps",
    ),
});

export const generateInterviewReport = async (
  resume: string,
  selfDescrption: string,
  jobDescription: string,
) => {
  const prompt = `

    you are an expert interviewer and career coach. 
      Given a candidate's resume, self description, and job description, generate a comprehensive interview report.
      
      The report should include:
      1. Technical questions: 10-15 technical questions based on the resume and job description
      2. Behavioral questions: 5-10 behavioral questions based on the resume and self description
      3. Skill gaps: 5-10 skill gaps based on the job description and resume
      4. Preparation plan: Day-wise preparation plan for 7 days

    resume: ${resume},
    selfDescrption: ${selfDescrption},
    jobDescription: ${jobDescription}

  `;

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `
      you are an expert interviewer and career coach. 
      Given a candidate's resume, self description, and job description, generate a comprehensive interview report.
      
      The report should include:
      1. Technical questions: 10-15 technical questions based on the resume and job description
      2. Behavioral questions: 5-10 behavioral questions based on the resume and self description
      3. Skill gaps: 5-10 skill gaps based on the job description and resume
      4. Preparation plan: Day-wise preparation plan for 7 days
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  return response.text;
};
