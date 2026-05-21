import api from "../../../services/apiClient.ts";

export interface InterviewReport {
  _id: string;
  userId: string;
  jobDescription: string;
  resume?: string;
  selfDescription?: string;
  matchScore: number;
  technicalQuestions: Array<{
    question: string;
    intention: string;
    answer: string;
  }>;
  behavioralQuestions: Array<{
    question: string;
    intention: string;
    answer: string;
  }>;
  skillGaps: Array<{
    skill: string;
    severity: "low" | "medium" | "high";
  }>;
  preparationPlan: Array<{
    day: number;
    focus: string;
    tasks: string[];
  }>;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export const generateReport = async (
  formData: FormData,
): Promise<InterviewReport> => {
  try {
    const response = await api.post(`/v1/interview`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error("Error generating interview report:", error);
    throw error.response?.data?.message || "Failed to generate report";
  }
};

export const getReportById = async (id: string): Promise<InterviewReport> => {
  try {
    const response = await api.get(`/v1/interview/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching report details:", error);
    throw error.response?.data?.message || "Failed to fetch report details";
  }
};

export const getUserReports = async (): Promise<InterviewReport[]> => {
  try {
    const response = await api.get(`/v1/interview`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching user reports:", error);
    throw error.response?.data?.message || "Failed to fetch user reports";
  }
};

export const deleteReport = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/v1/interview/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting report:", error);
    throw error.response?.data?.message || "Failed to delete report";
  }
};
