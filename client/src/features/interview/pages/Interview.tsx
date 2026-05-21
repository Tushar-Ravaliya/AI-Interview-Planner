import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getReportById } from "../api/interview.api";
import type { InterviewReport } from "../api/interview.api";
import { 
  ArrowLeft, 
  BrainCircuit, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Calendar, 
  CheckSquare, 
  Square,
  BookmarkCheck,
  AlertCircle,
  HelpCircle,
  Clock
} from "lucide-react";

export default function Interview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<InterviewReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"questions" | "skills" | "plan">("questions");
  const [questionType, setQuestionType] = useState<"technical" | "behavioral">("technical");
  
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
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAnswerReveal = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Avoid closing the accordion when clicking the inner reveal button
    setRevealedAnswers((prev) => 
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => 
      prev.includes(taskKey) ? prev.filter((k) => k !== taskKey) : [...prev, taskKey]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <BrainCircuit className="w-12 h-12 text-indigo-400 animate-pulse" />
          <p className="text-slate-400 text-sm font-medium">Fetching interview details...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Report</h3>
        <p className="text-slate-400 text-sm max-w-md mb-6">{error || "The requested interview prep report could not be found."}</p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  // Calculate circular progress parameters
  const score = report.matchScore || 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine score colors
  const getScoreColor = (val: number) => {
    if (val >= 80) return "text-emerald-400 stroke-emerald-400";
    if (val >= 60) return "text-amber-400 stroke-amber-400";
    return "text-rose-500 stroke-rose-500";
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-rose-500/10 border border-rose-500/20 text-rose-300";
      case "medium":
        return "bg-amber-500/10 border border-amber-500/20 text-amber-300";
      default:
        return "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300";
    }
  };

  const questionsList = questionType === "technical" ? report.technicalQuestions : report.behavioralQuestions;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden pb-16">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-fuchsia-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Header bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">
            Intervuo AI
          </span>
        </div>
      </header>

      {/* Report Dashboard Layout */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 mt-10 space-y-8 flex-1">
        {/* Overview Banner Card */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {report.title || "Target Role Analysis"}
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Custom-tailored preparation roadmap constructed based on your profile comparison with the target role description.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5 bg-slate-950/50 border border-slate-800/80 px-2.5 py-1 rounded-md">
                <Calendar className="w-3.5 h-3.5" />
                <span>Generated {new Date(report.createdAt).toLocaleDateString()}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/50 border border-slate-800/80 px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                <span>Interview Prep Ready</span>
              </span>
            </div>
          </div>

          {/* Match Score Radial Progress */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-slate-800/70"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Score Progress Path */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Central Text */}
              <div className="absolute text-center">
                <span className="text-2xl font-black text-white">{score}%</span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">FIT</span>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium">Profile Match Score</span>
          </div>
        </section>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800/80 gap-6">
          {[
            { id: "questions", title: "Practice Questions", count: (report.technicalQuestions?.length || 0) + (report.behavioralQuestions?.length || 0) },
            { id: "skills", title: "Skill Gaps Analysis", count: report.skillGaps?.length || 0 },
            { id: "plan", title: "Preparation Schedule", count: report.preparationPlan?.length || 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-1 text-sm font-semibold tracking-wide transition-all relative border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "text-indigo-400 border-indigo-500"
                  : "text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              <span>{tab.title}</span>
              {tab.count > 0 && (
                <span className="ml-2 text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Practice Questions Content */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            {/* Question Type Toggle */}
            <div className="flex gap-3 bg-slate-900/60 border border-slate-800/80 p-1 rounded-xl max-w-sm">
              <button
                onClick={() => { setQuestionType("technical"); setOpenQuestions([]); setRevealedAnswers([]); }}
                className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  questionType === "technical"
                    ? "bg-indigo-500 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Technical ({report.technicalQuestions?.length || 0})
              </button>
              <button
                onClick={() => { setQuestionType("behavioral"); setOpenQuestions([]); setRevealedAnswers([]); }}
                className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  questionType === "behavioral"
                    ? "bg-indigo-500 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Behavioral ({report.behavioralQuestions?.length || 0})
              </button>
            </div>

            {/* Questions Accordion */}
            {questionsList && questionsList.length > 0 ? (
              <div className="space-y-4">
                {questionsList.map((q, idx) => {
                  const isOpen = openQuestions.includes(idx);
                  const isAnswerRevealed = revealedAnswers.includes(idx);
                  return (
                    <div 
                      key={idx}
                      className={`bg-slate-900/30 border rounded-2xl transition-all ${
                        isOpen 
                          ? "border-slate-700/80 bg-slate-900/50" 
                          : "border-slate-800/60 hover:border-slate-700 bg-slate-900/20"
                      }`}
                    >
                      {/* Accordion Trigger */}
                      <button
                        onClick={() => toggleQuestion(idx)}
                        className="w-full flex items-center justify-between p-5 text-left gap-4 cursor-pointer"
                      >
                        <div className="flex gap-4 items-start">
                          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-bold text-xs shrink-0 mt-0.5">
                            Q{idx + 1}
                          </span>
                          <h3 className="text-sm font-semibold text-slate-200 leading-snug">{q.question}</h3>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {/* Accordion Content */}
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                          {/* Intention */}
                          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
                            <h4 className="font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Interviewer's Intention</span>
                            </h4>
                            <p className="text-slate-400 leading-relaxed font-sans">{q.intention}</p>
                          </div>

                          {/* Answer Area */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Response Guideline</h4>
                              <button
                                onClick={(e) => toggleAnswerReveal(e, idx)}
                                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
                              >
                                {isAnswerRevealed ? "Hide Guide" : "Show Guide"}
                              </button>
                            </div>

                            {isAnswerRevealed ? (
                              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-slate-300 space-y-2 leading-relaxed animate-fadeIn">
                                <p className="font-sans whitespace-pre-line">{q.answer}</p>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => toggleAnswerReveal(e, idx)}
                                className="w-full py-6 rounded-xl border border-dashed border-slate-800/80 hover:border-indigo-500/30 bg-slate-950/20 hover:bg-indigo-500/5 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer"
                              >
                                <HelpCircle className="w-6 h-6 text-slate-500" />
                                <span className="text-xs font-semibold text-slate-400">Click to reveal recommended response template</span>
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
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-400 text-sm">No practice questions generated.</p>
              </div>
            )}
          </div>
        )}

        {/* Skill Gaps Content */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Identified Skill Discrepancies</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              Based on the semantic analysis of your resume and the target role criteria, here are the key technical or soft skill mismatches identified, sorted by priority.
            </p>

            {report.skillGaps && report.skillGaps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.skillGaps.map((gap, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/30 border border-slate-850/60 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-200">{gap.skill}</h4>
                      <p className="text-xs text-slate-500">
                        {gap.severity === "high" 
                          ? "Critical gap: Core job requirement. Focus highly on this." 
                          : gap.severity === "medium"
                            ? "Important skill: Commonly expected. Good to prepare."
                            : "Recommended skill: Bonus qualifier."}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${getSeverityStyle(gap.severity)}`}>
                      {gap.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                <BookmarkCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">Outstanding Profile Alignment!</h4>
                <p className="text-slate-400 text-xs mt-1">No significant skill gaps were detected for this position.</p>
              </div>
            )}
          </div>
        )}

        {/* Preparation Plan Content */}
        {activeTab === "plan" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Custom Preparation Timeline</h2>
              <p className="text-slate-400 text-sm">
                A chronologically organized training roadmap. Check off tasks as you prepare.
              </p>
            </div>

            {report.preparationPlan && report.preparationPlan.length > 0 ? (
              <div className="relative border-l border-slate-800 ml-4 pl-8 space-y-10 py-2">
                {report.preparationPlan.map((dayData, dayIdx) => (
                  <div key={dayIdx} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center text-xs font-bold text-indigo-400 shadow-lg group-hover:scale-105 transition-transform">
                      {dayData.day}
                    </div>

                    {/* Day Content Card */}
                    <div className="bg-slate-900/20 hover:bg-slate-900/30 border border-slate-850/60 rounded-2xl p-5 md:p-6 transition-all space-y-4">
                      <div>
                        <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Day {dayData.day} Focus</span>
                        <h3 className="text-base font-bold text-white mt-1">{dayData.focus}</h3>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-2.5">
                        {dayData.tasks?.map((task, taskIdx) => {
                          const taskKey = `${dayIdx}-${taskIdx}`;
                          const isDone = completedTasks.includes(taskKey);
                          return (
                            <button
                              key={taskIdx}
                              onClick={() => toggleTask(taskKey)}
                              className="w-full flex items-start gap-3 p-2 hover:bg-slate-950/40 rounded-lg text-left transition-all cursor-pointer group/item"
                            >
                              {isDone ? (
                                <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-600 group-hover/item:text-slate-400 mt-0.5 shrink-0" />
                              )}
                              <span 
                                className={`text-xs ${
                                  isDone 
                                    ? "text-slate-500 line-through font-medium" 
                                    : "text-slate-300"
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
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-400 text-sm">No daily preparation timeline found.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
