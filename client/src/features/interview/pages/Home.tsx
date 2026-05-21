import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { generateReport } from "../api/interview.api";
import {
  BrainCircuit,
  UploadCloud,
  FileText,
  Sparkles,
  LogOut,
  Briefcase,
  User,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  BookmarkCheck,
  TrendingUp,
  Award,
} from "lucide-react";

export default function Home() {
  const { user, handleSignOut } = useAuth();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Custom staggered messages for the generation process
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    "Uploading and parsing resume PDF...",
    "Extracting core competencies and experience...",
    "Analyzing target job requirements...",
    "Identifying technical and behavioral skill gaps...",
    "Generating context-aware interview questions...",
    "Drafting detailed sample answers...",
    "Formulating a day-by-day preparation schedule...",
    "Finalizing your personalized dashboard...",
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) =>
          prev < loadingSteps.length - 1 ? prev + 1 : prev,
        );
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setResumeFile(file);
        setError("");
      } else {
        setError("Only PDF files are supported for resume analysis.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setResumeFile(file);
        setError("");
      } else {
        setError("Only PDF files are supported for resume analysis.");
      }
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter the target job description.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    try {
      const report = await generateReport(formData);
      navigate(`/interview/${report._id}`);
    } catch (err: any) {
      setError(
        err ||
          "Failed to generate interview preparation report. Please try again.",
      );
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            Intervuo AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/reports"
            className="text-slate-400 hover:text-white transition-colors text-sm font-semibold mr-2"
          >
            My Reports
          </Link>
          <div className="hidden sm:flex flex-col items-end text-sm">
            <span className="text-slate-300 font-medium">
              {user?.username || "Developer"}
            </span>
            <span className="text-xs text-slate-500">{user?.email || ""}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Hero & Insights */}
        <section className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Readiness Engine</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Bridge the Gap <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-500">
                To Your Next Role.
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-lg">
              Upload your resume and the job specification. Intervuo AI parses
              the criteria, compares your background, spotlights skill gaps, and
              prepares custom technical and behavioral interview prep guides.
            </p>
          </div>

          {/* Quick Metrics / Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <BookmarkCheck className="w-5 h-5 text-indigo-400 mb-2" />
              <div className="text-xl font-bold text-white">94%</div>
              <div className="text-xs text-slate-400">Match Accuracy</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <TrendingUp className="w-5 h-5 text-fuchsia-400 mb-2" />
              <div className="text-xl font-bold text-white">10x</div>
              <div className="text-xs text-slate-400">Faster Prep Time</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <Award className="w-5 h-5 text-pink-400 mb-2" />
              <div className="text-xl font-bold text-white">Instance</div>
              <div className="text-xs text-slate-400">Custom Reports</div>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              How it works
            </h3>
            <div className="space-y-3">
              {[
                {
                  step: "1",
                  title: "Upload your PDF resume",
                  desc: "We parse your actual projects, tech stack, and experience.",
                },
                {
                  step: "2",
                  title: "Paste the Job Description",
                  desc: "Provide details of the position you are interviewing for.",
                },
                {
                  step: "3",
                  title: "Get Your Readiness Package",
                  desc: "Unlock score, questions, answers, and study roadmaps instantly.",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">
                      {s.title}
                    </h4>
                    <p className="text-xs text-slate-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Form Card */}
        <section className="lg:col-span-7">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-8 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-white mb-6">
              Create Preparation Plan
            </h2>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Drag and Drop Resume */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Upload Resume <span className="text-indigo-400">*</span>
                </label>

                {!resumeFile ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                      isDragActive
                        ? "border-indigo-500 bg-indigo-500/5 shadow-inner"
                        : "border-slate-800 hover:border-slate-700 bg-slate-950/20 hover:bg-slate-950/40"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/80 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-200">
                        Drag & drop your resume, or{" "}
                        <span className="text-indigo-400">browse</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports PDF files only
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/25">
                        <FileText className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatFileSize(resumeFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Target Job Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Target Job Description{" "}
                  <span className="text-indigo-400">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute top-3.5 left-3 flex items-start pointer-events-none">
                    <Briefcase className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <textarea
                    rows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-800 bg-slate-950/40 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans text-sm resize-y"
                    placeholder="Paste the job description, key requirements, roles/responsibilities here..."
                  />
                </div>
              </div>

              {/* Self Description / Highlights */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-300">
                    Self Description / Context
                  </label>
                  <span className="text-xs text-slate-500">Optional</span>
                </div>
                <div className="relative group">
                  <div className="absolute top-3.5 left-3 flex items-start pointer-events-none">
                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <textarea
                    rows={3}
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-800 bg-slate-950/40 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans text-sm resize-y"
                    placeholder="Highlight specific career achievements, custom skills, or what you want this preparation to focus on..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-semibold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-indigo-200" />
                <span>Generate Preparation Plan</span>
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-md w-full px-6 flex flex-col items-center text-center">
            {/* Spinning Loader */}
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-full border border-indigo-500/20 absolute"></div>
              <div className="w-20 h-20 rounded-full border-t-2 border-indigo-500 animate-spin absolute"></div>
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-indigo-400" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2">
              Analyzing Profile
            </h3>

            {/* Staggered Status steps */}
            <div className="h-10 flex items-center justify-center mb-6">
              <p className="text-indigo-200 text-sm font-medium animate-pulse">
                {loadingSteps[loadingStep]}
              </p>
            </div>

            {/* Visual Steps Checkboxes */}
            <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2.5">
              {loadingSteps.map((stepMsg, idx) => {
                const isCompleted = idx < loadingStep;
                const isActive = idx === loadingStep;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 transition-opacity duration-300"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-800 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        isCompleted
                          ? "text-slate-400 line-through"
                          : isActive
                            ? "text-indigo-300 font-semibold"
                            : "text-slate-600"
                      }`}
                    >
                      {stepMsg}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
