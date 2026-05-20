import mongoose from "mongoose";

const TechnicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    intention: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    intention: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    focus: {
      type: String,
      required: true,
    },
    tasks: {
      type: [String],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const interviewReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    jobDescription: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
    },
    selfDescription: {
      type: String,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: {
      type: [TechnicalQuestionSchema],
    },
    behavioralQuestions: {
      type: [behavioralQuestionSchema],
    },
    skillGaps: {
      type: [skillGapSchema],
    },
    preparationPlan: {
      type: [preparationPlanSchema],
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const interviewReportModel = mongoose.model(
  "interviewReport",
  interviewReportSchema,
);
