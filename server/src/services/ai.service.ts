import { GoogleGenAI } from "@google/genai";
import { config } from "../config/config";
import z from "zod";

const genAI = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

export const generateInterviewReport = async ({
  resume,
  selfDescription,
  jobDescription,
}: {
  resume: string;
  selfDescription: string;
  jobDescription: string;
}) => {
  const prompt = `You are a world-class Technical Recruiter and Expert Interview Coach.
Your task is to generate a comprehensive, highly personalized, and realistic interview preparation report for a candidate applying to a target job role.

Evaluate the candidate based on the following details:
- **Resume Content**:
"""
${resume}
"""
- **Candidate's Self-Description (Motivation, current context, expectations)**:
"""
${selfDescription}
"""
- **Target Job Description**:
"""
${jobDescription}
"""

Please adhere strictly to the following instructions for each schema field:

1. **title**: Extract the exact target job title from the Job Description. If it is ambiguous, infer the most accurate and common professional title (e.g. "Senior Full Stack Engineer").

2. **matchScore**: Calculate a realistic and objective score between 0 and 100 representing how well the candidate fits the target role.
   - 90-100: Candidate is an exceptionally strong match, possessing nearly all core and secondary skills, and relevant experience.
   - 70-89: Good match but has some clear skill gaps or experience mismatches.
   - 50-69: Moderate match with significant skill gaps or lesser experience.
   - <50: Weak match.
   Be honest and critical; do not default to generic high scores.

3. **technicalQuestions**: Generate 5 to 8 challenging and highly relevant technical questions.
   - Tailor the questions to both the Job Description requirements (e.g. core technologies, architecture, patterns) and the candidate's actual experience level.
   - **intention**: For each question, explain the exact engineering logic, system/concept depth, or problem-solving capability the interviewer is trying to evaluate (e.g., "To test the candidate's understanding of database index behavior under write-heavy loads").
   - **answer**: Provide a highly structured, comprehensive, and clear guide on how the candidate should answer. Mention key concepts to touch upon, step-by-step reasoning/approaches, important trade-offs, and brief outline/hints of the code or architecture to explain. Do not write generic or short answers.

4. **behavioralQuestions**: Generate 3 to 5 behavioral questions.
   - Focus on leadership, conflict resolution, ownership, prioritization, dealing with ambiguity, or teamwork based on the seniority and style of the role.
   - **intention**: Explain the underlying soft skill, psychological trait, or cultural alignment being assessed.
   - **answer**: Provide a structured guide on how to frame the response using the STAR method (Situation, Task, Action, Result), detailing what kind of story from the candidate's background would fit best.

5. **skillGaps**: Analyze the target Job Description against the candidate's Resume and Self-Description to identify specific skills, technologies, methodologies, or experience levels that are missing or weak.
   - **skill**: Clearly name the missing or weak skill (e.g. "Kubernetes & Container Orchestration", "System Design for High-Throughput Pipelines").
   - **severity**: Assign a severity level:
     - "high": Crucial for the job (e.g. core language/framework, essential experience).
     - "medium": Highly valued and expected, but might be learned on the job.
     - "low": Nice-to-have, soft skill, or secondary tools.

6. **preparationPlan**: Develop a highly actionable, structured, day-by-day preparation roadmap (usually 5 to 7 days, sequential starting from day 1).
   - **day**: Sequential day number starting from 1.
   - **focus**: A clear, specific topic/domain for that day (e.g., "Day 1: Microservices Architecture & System Design Gaps").
   - **tasks**: Provide 3 to 5 highly specific, actionable, and concrete preparation tasks for that day (e.g., "Read up on Kafka partition keys and write-ahead logs", "Implement a mock rate limiter locally to practice token bucket algorithm", "Practice describing your most recent conflict using the STAR method"). Do not use generic tasks like "Study system design" or "Practice coding".
`;

  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(interviewReportSchema),
    },
  });

  if (!response.text) {
    throw new Error("AI model returned an empty response");
  }

  return JSON.parse(response.text);
};
