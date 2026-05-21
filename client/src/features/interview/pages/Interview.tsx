import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { getReportById } from "../api/interview.api";
import type { InterviewReport } from "../api/interview.api";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Award,
  Calendar,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
  Clock,
} from "lucide-react";

export default function Interview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<InterviewReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"questions" | "skills" | "plan">(
    "questions",
  );
  const [questionType, setQuestionType] = useState<"technical" | "behavioral">(
    "technical",
  );

  // Track open states for question accordions
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);
  // Track revealed answers
  const [revealedAnswers, setRevealedAnswers] = useState<number[]>([]);
  // Track preparation plan checklist tasks (Key: day-index)
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getReportById(id);
        setReport(data);
      } catch (err: any) {
        setError(err || "Failed to load interview preparation report.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const toggleQuestion = (index: number) => {
    setOpenQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const toggleAnswerReveal = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Avoid closing the accordion when clicking the inner reveal button
    setRevealedAnswers((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) =>
      prev.includes(taskKey)
        ? prev.filter((k) => k !== taskKey)
        : [...prev, taskKey],
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-noir-950 flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot" />
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot delay-200" />
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot delay-400" />
        </div>
        <p className="text-noir-400 text-sm font-body">
          Loading interview report...
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-noir-950 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-8 h-8 text-danger mb-4" />
        <h3 className="font-display text-xl font-bold text-bone mb-2">
          Error Loading Report
        </h3>
        <p className="text-noir-400 text-sm font-body max-w-md mb-6">
          {error || "The requested interview prep report could not be found."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-2.5 bg-noir-900 border border-noir-700 hover:border-gold/30 text-bone rounded-sm transition-all duration-300 text-sm font-body"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  const score = report.matchScore || 0;

  const getScoreColor = (val: number) => {
    if (val >= 80) return "text-success";
    if (val >= 60) return "text-gold";
    return "text-danger-soft";
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-danger/10 text-danger-soft border-l-2 border-danger";
      case "medium":
        return "bg-gold/10 text-gold border-l-2 border-gold-dim";
      default:
        return "bg-success/10 text-success border-l-2 border-success-soft";
    }
  };

  const getSeverityBarWidth = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "w-full";
      case "medium": return "w-2/3";
      default: return "w-1/3";
    }
  };

  const getSeverityBarColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-danger";
      case "medium": return "bg-gold-dim";
      default: return "bg-success-soft";
    }
  };

  const questionsList =
    questionType === "technical"
      ? report.technicalQuestions
      : report.behavioralQuestions;

  return (
    <div className="relative min-h-screen bg-noir-950 text-bone flex flex-col overflow-hidden pb-16">
      {/* Noise grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px"}} />

      {/* Header */}
      <header className="relative z-10 w-full border-b border-noir-800/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-noir-400 hover:text-bone transition-colors duration-300 text-sm font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <div className="flex items-center gap-6">
            <Link
              to="/reports"
              className="text-noir-400 hover:text-bone text-sm font-body font-medium transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left pb-0.5"
            >
              Reports
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-bone tracking-tight">
                Intervuo
              </span>
              <span className="text-gold text-xs font-body font-semibold tracking-[0.2em] uppercase mt-0.5">
                AI
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Report Content */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-10 mt-10 space-y-10 flex-1">
        {/* Overview Banner */}
        <section className="bg-noir-900 border border-noir-800 rounded-sm relative animate-fade-in-up">
          {/* Gold top accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-gold via-gold/50 to-transparent" />

          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left flex-1">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-bone tracking-tight leading-tight">
                {report.title || "Target Role Analysis"}
              </h1>
              <p className="text-noir-400 text-sm font-body font-light max-w-xl">
                Custom-tailored preparation roadmap based on your profile
                comparison with the target role.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-noir-500 font-body pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </span>
                <span className="text-noir-700">|</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Interview Prep Ready</span>
                </span>
              </div>
            </div>

            {/* Match Score — Editorial large number, not circular gauge */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className={`font-display text-6xl md:text-7xl font-bold tracking-tight ${getScoreColor(score)}`}>
                {score}
              </span>
              <div className="w-12 h-px bg-gold mt-1" />
              <span className="text-noir-400 text-[10px] font-body tracking-[0.2em] uppercase font-semibold mt-2">
                Profile Fit
              </span>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex border-b border-noir-800 gap-8 animate-fade-in delay-200">
          {[
            {
              id: "questions",
              title: "Practice Questions",
              count:
                (report.technicalQuestions?.length || 0) +
                (report.behavioralQuestions?.length || 0),
            },
            {
              id: "skills",
              title: "Skill Gaps",
              count: report.skillGaps?.length || 0,
            },
            {
              id: "plan",
              title: "Prep Schedule",
              count: report.preparationPlan?.length || 0,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-1 text-sm font-body font-medium transition-all duration-300 relative border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "text-bone border-gold"
                  : "text-noir-400 border-transparent hover:text-bone-dim"
              }`}
            >
              <span className="font-display">{tab.title}</span>
              {tab.count > 0 && (
                <span className={`ml-2 text-xs font-body font-medium ${activeTab === tab.id ? "text-gold" : "text-noir-500"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Practice Questions Content */}
        {activeTab === "questions" && (
          <div className="space-y-6 animate-fade-in">
            {/* Question Type Toggle */}
            <div className="flex gap-1 bg-noir-900 border border-noir-800 p-1 rounded-sm max-w-xs">
              <button
                onClick={() => {
                  setQuestionType("technical");
                  setOpenQuestions([]);
                  setRevealedAnswers([]);
                }}
                className={`flex-1 text-center py-2 px-3 rounded-sm text-xs font-body font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                  questionType === "technical"
                    ? "bg-gold text-noir-950"
                    : "text-noir-400 hover:text-bone"
                }`}
              >
                Technical ({report.technicalQuestions?.length || 0})
              </button>
              <button
                onClick={() => {
                  setQuestionType("behavioral");
                  setOpenQuestions([]);
                  setRevealedAnswers([]);
                }}
                className={`flex-1 text-center py-2 px-3 rounded-sm text-xs font-body font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                  questionType === "behavioral"
                    ? "bg-gold text-noir-950"
                    : "text-noir-400 hover:text-bone"
                }`}
              >
                Behavioral ({report.behavioralQuestions?.length || 0})
              </button>
            </div>

            {/* Questions Accordion */}
            {questionsList && questionsList.length > 0 ? (
              <div className="space-y-3">
                {questionsList.map((q, idx) => {
                  const isOpen = openQuestions.includes(idx);
                  const isAnswerRevealed = revealedAnswers.includes(idx);
                  return (
                    <div
                      key={idx}
                      className={`bg-noir-900/60 border rounded-sm transition-all duration-300 ${
                        isOpen
                          ? "border-noir-700 bg-noir-900"
                          : "border-noir-800 hover:border-noir-700"
                      }`}
                    >
                      {/* Accordion Trigger */}
                      <button
                        onClick={() => toggleQuestion(idx)}
                        className="w-full flex items-center justify-between p-5 text-left gap-4 cursor-pointer"
                      >
                        <div className="flex gap-4 items-start">
                          <span className="font-display text-lg font-bold text-noir-600 shrink-0 mt-0.5 w-8">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-sm font-body font-medium text-bone leading-relaxed">
                            {q.question}
                          </h3>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-noir-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-noir-400 shrink-0" />
                        )}
                      </button>

                      {/* Accordion Content */}
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-noir-800 space-y-5">
                          {/* Intention */}
                          <div className="py-3 px-4 bg-noir-850 border-l-2 border-gold text-xs">
                            <h4 className="font-body font-semibold text-gold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5" />
                              <span>Interviewer's Intention</span>
                            </h4>
                            <p className="text-noir-300 leading-relaxed font-body">
                              {q.intention}
                            </p>
                          </div>

                          {/* Answer Area */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-body font-semibold text-noir-400 uppercase tracking-wider">
                                Suggested Response
                              </h4>
                              <button
                                onClick={(e) => toggleAnswerReveal(e, idx)}
                                className="text-xs text-gold hover:text-gold-light font-body font-medium transition-colors duration-300 cursor-pointer"
                              >
                                {isAnswerRevealed ? "Hide" : "Reveal"}
                              </button>
                            </div>

                            {isAnswerRevealed ? (
                              <div className="py-4 px-5 bg-noir-850 border-l-2 border-gold/40 text-xs text-noir-300 leading-relaxed font-body">
                                <p className="whitespace-pre-line">{q.answer}</p>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => toggleAnswerReveal(e, idx)}
                                className="w-full py-8 border border-dashed border-noir-700 hover:border-gold/30 bg-noir-950/30 hover:bg-gold/5 transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 cursor-pointer rounded-sm"
                              >
                                <HelpCircle className="w-5 h-5 text-noir-600" />
                                <span className="text-xs font-body text-noir-400">
                                  Click to reveal response guide
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center border border-dashed border-noir-800 rounded-sm">
                <p className="text-noir-400 text-sm font-body">
                  No practice questions generated.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Skill Gaps Content */}
        {activeTab === "skills" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display text-lg font-bold text-bone">
                Skill Gap Analysis
              </h2>
              <p className="text-noir-400 text-sm font-body font-light mt-1 max-w-2xl">
                Key technical and soft skill gaps identified from semantic
                analysis of your resume against the target role, sorted by severity.
              </p>
            </div>

            {report.skillGaps && report.skillGaps.length > 0 ? (
              <div className="space-y-3">
                {report.skillGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-sm ${getSeverityStyle(gap.severity)} flex items-center justify-between gap-4`}
                  >
                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm font-body font-semibold text-bone">
                        {gap.skill}
                      </h4>
                      <p className="text-xs text-noir-400 font-body">
                        {gap.severity === "high"
                          ? "Critical — core job requirement. Focus highly."
                          : gap.severity === "medium"
                            ? "Important — commonly expected. Good to prepare."
                            : "Bonus — recommended qualifier."}
                      </p>
                      {/* Severity bar */}
                      <div className="w-full h-1 bg-noir-800 rounded-full mt-2">
                        <div className={`h-full rounded-full ${getSeverityBarWidth(gap.severity)} ${getSeverityBarColor(gap.severity)} transition-all duration-500`} />
                      </div>
                    </div>
                    <span className="text-[10px] font-body font-bold uppercase tracking-[0.2em] shrink-0">
                      {gap.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center bg-noir-900 border border-noir-800 rounded-sm">
                <div className="w-10 h-px bg-gold mx-auto mb-4" />
                <h4 className="text-sm font-display font-bold text-bone">
                  Outstanding Alignment
                </h4>
                <p className="text-noir-400 text-xs font-body mt-1">
                  No significant skill gaps detected for this role.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Preparation Plan Content */}
        {activeTab === "plan" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="font-display text-lg font-bold text-bone">
                Preparation Timeline
              </h2>
              <p className="text-noir-400 text-sm font-body font-light mt-1">
                A day-by-day training roadmap. Check off tasks as you prepare.
              </p>
            </div>

            {report.preparationPlan && report.preparationPlan.length > 0 ? (
              <div className="relative border-l border-noir-800 ml-5 pl-10 space-y-10 py-2">
                {report.preparationPlan.map((dayData, dayIdx) => (
                  <div key={dayIdx} className="relative group">
                    {/* Timeline node */}
                    <div className="absolute -left-[2.85rem] top-0 w-6 h-6 rounded-full bg-noir-950 border-2 border-gold flex items-center justify-center text-[10px] font-display font-bold text-gold group-hover:bg-gold group-hover:text-noir-950 transition-all duration-300">
                      {dayData.day}
                    </div>

                    {/* Day Card */}
                    <div className="bg-noir-900/50 hover:bg-noir-900 border border-noir-800 hover:border-noir-700 rounded-sm p-6 transition-all duration-300 space-y-4">
                      <div>
                        <span className="text-[10px] text-gold font-body font-semibold uppercase tracking-[0.2em]">
                          Day {dayData.day}
                        </span>
                        <h3 className="font-display text-base font-bold text-bone mt-1">
                          {dayData.focus}
                        </h3>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-2">
                        {dayData.tasks?.map((task, taskIdx) => {
                          const taskKey = `${dayIdx}-${taskIdx}`;
                          const isDone = completedTasks.includes(taskKey);
                          return (
                            <button
                              key={taskIdx}
                              onClick={() => toggleTask(taskKey)}
                              className="w-full flex items-start gap-3 py-2 px-2 hover:bg-noir-850 rounded-sm text-left transition-all duration-200 cursor-pointer group/item"
                            >
                              {isDone ? (
                                <CheckSquare className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-noir-600 group-hover/item:text-noir-400 mt-0.5 shrink-0" />
                              )}
                              <span
                                className={`text-xs font-body ${
                                  isDone
                                    ? "text-noir-500 line-through"
                                    : "text-noir-300"
                                }`}
                              >
                                {task}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center border border-dashed border-noir-800 rounded-sm">
                <p className="text-noir-400 text-sm font-body">
                  No preparation timeline generated.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
