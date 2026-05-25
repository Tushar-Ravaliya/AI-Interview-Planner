import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { getReportById } from "../api/interview.api";
import type { InterviewReport } from "../api/interview.api";

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
      <div className="min-h-screen bg-parchment flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot" />
          <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot delay-200" />
          <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot delay-400" />
        </div>
        <p className="text-ink-muted text-sm font-sans">
          Loading interview report...
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col items-center justify-center p-6 text-center">
        <svg className="w-6 h-6 text-warm-red mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <h3 className="font-serif text-xl text-ink mb-2">
          Error Loading Report
        </h3>
        <p className="text-ink-muted text-sm font-sans max-w-md mb-6">
          {error || "The requested interview prep report could not be found."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border hover:border-terra/30 text-ink rounded-md transition-all duration-300 text-sm font-sans"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const score = report.matchScore || 0;

  const getScoreColor = (val: number) => {
    if (val >= 80) return "text-sage";
    if (val >= 60) return "text-amber";
    return "text-warm-red";
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-warm-red-ghost border-l-2 border-warm-red";
      case "medium":
        return "bg-amber-ghost border-l-2 border-amber";
      default:
        return "bg-sage-ghost border-l-2 border-sage";
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
      case "high": return "bg-warm-red";
      case "medium": return "bg-amber";
      default: return "bg-sage";
    }
  };

  const questionsList =
    questionType === "technical"
      ? report.technicalQuestions
      : report.behavioralQuestions;

  return (
    <div className="min-h-screen bg-parchment text-ink flex flex-col pb-16">
      {/* Header */}
      <header className="w-full border-b border-border">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-ink-muted hover:text-ink transition-colors duration-300 text-sm font-sans"
          >
            ← Dashboard
          </button>
          <div className="flex items-center gap-6">
            <Link
              to="/reports"
              className="text-ink-muted hover:text-ink text-sm font-sans font-medium transition-colors duration-300"
            >
              Reports
            </Link>
            <h1 className="font-serif text-lg text-ink">Intervuo</h1>
          </div>
        </div>
      </header>

      {/* Report Content */}
      <main className="w-full max-w-5xl mx-auto px-6 lg:px-10 mt-10 space-y-10 flex-1">
        {/* Overview Banner */}
        <section className="bg-surface border border-border rounded-lg animate-enter-up">
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left flex-1">
              <h2 className="font-serif text-2xl md:text-3xl text-ink leading-tight">
                {report.title || "Target Role Analysis"}
              </h2>
              <p className="text-ink-muted text-sm font-sans font-light max-w-xl">
                Custom-tailored preparation roadmap based on your profile
                comparison with the target role.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-ink-faint font-sans pt-1">
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                <span className="text-border">|</span>
                <span>Interview Prep Ready</span>
              </div>
            </div>

            {/* Match Score */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <span className={`font-serif text-6xl md:text-7xl tracking-tight ${getScoreColor(score)}`}>
                {score}
              </span>
              <div className="w-10 h-px bg-terra mt-1" />
              <span className="text-ink-muted text-[10px] font-sans tracking-[0.15em] uppercase font-medium mt-2">
                Profile Fit
              </span>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex border-b border-border gap-8 animate-enter delay-200">
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
              className={`pb-4 px-1 text-sm font-sans font-medium transition-all duration-300 border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "text-ink border-terra"
                  : "text-ink-muted border-transparent hover:text-ink-light"
              }`}
            >
              <span>{tab.title}</span>
              {tab.count > 0 && (
                <span className={`ml-2 text-xs font-sans ${activeTab === tab.id ? "text-terra" : "text-ink-ghost"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Practice Questions Content */}
        {activeTab === "questions" && (
          <div className="space-y-6 animate-enter">
            {/* Question Type Toggle */}
            <div className="flex gap-1 bg-parchment-dim border border-border p-1 rounded-md max-w-xs">
              <button
                onClick={() => {
                  setQuestionType("technical");
                  setOpenQuestions([]);
                  setRevealedAnswers([]);
                }}
                className={`flex-1 text-center py-2 px-3 rounded text-xs font-sans font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                  questionType === "technical"
                    ? "bg-terra text-white"
                    : "text-ink-muted hover:text-ink"
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
                className={`flex-1 text-center py-2 px-3 rounded text-xs font-sans font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                  questionType === "behavioral"
                    ? "bg-terra text-white"
                    : "text-ink-muted hover:text-ink"
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
                      className={`bg-surface border rounded-lg transition-all duration-300 ${
                        isOpen
                          ? "border-border-hover"
                          : "border-border hover:border-border-hover"
                      }`}
                    >
                      {/* Accordion Trigger */}
                      <button
                        onClick={() => toggleQuestion(idx)}
                        className="w-full flex items-center justify-between p-5 text-left gap-4 cursor-pointer"
                      >
                        <div className="flex gap-4 items-start">
                          <span className="font-serif text-lg text-ink-ghost shrink-0 mt-0.5 w-8">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-sm font-sans font-medium text-ink leading-relaxed">
                            {q.question}
                          </h3>
                        </div>
                        <svg className={`w-4 h-4 text-ink-faint shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>

                      {/* Accordion Content */}
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-border space-y-5">
                          {/* Intention */}
                          <div className="py-3 px-4 bg-parchment-dim border-l-2 border-terra text-xs rounded-r">
                            <h4 className="font-sans font-medium text-terra uppercase tracking-wider mb-1.5">
                              Interviewer's Intention
                            </h4>
                            <p className="text-ink-light leading-relaxed font-sans">
                              {q.intention}
                            </p>
                          </div>

                          {/* Answer Area */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-sans font-medium text-ink-muted uppercase tracking-wider">
                                Suggested Response
                              </h4>
                              <button
                                onClick={(e) => toggleAnswerReveal(e, idx)}
                                className="text-xs text-terra hover:text-terra-hover font-sans font-medium transition-colors duration-300 cursor-pointer"
                              >
                                {isAnswerRevealed ? "Hide" : "Reveal"}
                              </button>
                            </div>

                            {isAnswerRevealed ? (
                              <div className="py-4 px-5 bg-parchment-dim border-l-2 border-terra/30 text-xs text-ink-light leading-relaxed font-sans rounded-r">
                                <p className="whitespace-pre-line">{q.answer}</p>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => toggleAnswerReveal(e, idx)}
                                className="w-full py-8 border border-dashed border-border hover:border-terra/30 bg-parchment-dim/50 hover:bg-terra-ghost transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 cursor-pointer rounded-md"
                              >
                                <svg className="w-5 h-5 text-ink-ghost" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                </svg>
                                <span className="text-xs font-sans text-ink-muted">
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
              <div className="p-12 text-center border border-dashed border-border rounded-lg">
                <p className="text-ink-muted text-sm font-sans">
                  No practice questions generated.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Skill Gaps Content */}
        {activeTab === "skills" && (
          <div className="space-y-6 animate-enter">
            <div>
              <h2 className="font-serif text-lg text-ink">
                Skill Gap Analysis
              </h2>
              <p className="text-ink-muted text-sm font-sans font-light mt-1 max-w-2xl">
                Key technical and soft skill gaps identified from semantic
                analysis of your resume against the target role, sorted by severity.
              </p>
            </div>

            {report.skillGaps && report.skillGaps.length > 0 ? (
              <div className="space-y-3">
                {report.skillGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-lg ${getSeverityStyle(gap.severity)} flex items-center justify-between gap-4`}
                  >
                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm font-sans font-medium text-ink">
                        {gap.skill}
                      </h4>
                      <p className="text-xs text-ink-muted font-sans">
                        {gap.severity === "high"
                          ? "Critical — core job requirement. Focus highly."
                          : gap.severity === "medium"
                            ? "Important — commonly expected. Good to prepare."
                            : "Bonus — recommended qualifier."}
                      </p>
                      {/* Severity bar */}
                      <div className="w-full h-0.5 bg-border rounded-full mt-2">
                        <div className={`h-full rounded-full ${getSeverityBarWidth(gap.severity)} ${getSeverityBarColor(gap.severity)} transition-all duration-500`} />
                      </div>
                    </div>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] shrink-0 text-ink-muted">
                      {gap.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center bg-surface border border-border rounded-lg">
                <div className="w-8 h-px bg-terra mx-auto mb-4" />
                <h4 className="text-sm font-serif text-ink">
                  Outstanding Alignment
                </h4>
                <p className="text-ink-muted text-xs font-sans mt-1">
                  No significant skill gaps detected for this role.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Preparation Plan Content */}
        {activeTab === "plan" && (
          <div className="space-y-6 animate-enter">
            <div>
              <h2 className="font-serif text-lg text-ink">
                Preparation Timeline
              </h2>
              <p className="text-ink-muted text-sm font-sans font-light mt-1">
                A day-by-day training roadmap. Check off tasks as you prepare.
              </p>
            </div>

            {report.preparationPlan && report.preparationPlan.length > 0 ? (
              <div className="relative border-l border-border ml-5 pl-10 space-y-10 py-2">
                {report.preparationPlan.map((dayData, dayIdx) => (
                  <div key={dayIdx} className="relative group">
                    {/* Timeline node */}
                    <div className="absolute -left-[2.85rem] top-0 w-6 h-6 rounded-full bg-parchment border-2 border-terra flex items-center justify-center text-[10px] font-sans font-semibold text-terra group-hover:bg-terra group-hover:text-white transition-all duration-300">
                      {dayData.day}
                    </div>

                    {/* Day Card */}
                    <div className="bg-surface hover:bg-surface-hover border border-border hover:border-border-hover rounded-lg p-6 transition-all duration-300 space-y-4">
                      <div>
                        <span className="text-[10px] text-terra font-sans font-medium uppercase tracking-[0.15em]">
                          Day {dayData.day}
                        </span>
                        <h3 className="font-serif text-base text-ink mt-1">
                          {dayData.focus}
                        </h3>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-1.5">
                        {dayData.tasks?.map((task, taskIdx) => {
                          const taskKey = `${dayIdx}-${taskIdx}`;
                          const isDone = completedTasks.includes(taskKey);
                          return (
                            <button
                              key={taskIdx}
                              onClick={() => toggleTask(taskKey)}
                              className="w-full flex items-start gap-3 py-2 px-2 hover:bg-parchment-dim rounded text-left transition-all duration-200 cursor-pointer group/item"
                            >
                              {isDone ? (
                                <svg className="w-4 h-4 text-terra mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <div className="w-4 h-4 rounded border border-border-hover group-hover/item:border-ink-faint mt-0.5 shrink-0 transition-colors" />
                              )}
                              <span
                                className={`text-xs font-sans ${
                                  isDone
                                    ? "text-ink-ghost line-through"
                                    : "text-ink-light"
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
              <div className="p-12 text-center border border-dashed border-border rounded-lg">
                <p className="text-ink-muted text-sm font-sans">
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
