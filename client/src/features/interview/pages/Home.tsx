import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { generateReport } from "../api/interview.api";

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
    <div className="min-h-screen bg-parchment text-ink flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-serif text-xl text-ink">Intervuo</h1>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-ink text-sm font-sans font-medium border-b border-terra pb-0.5"
              >
                Dashboard
              </Link>
              <Link
                to="/reports"
                className="text-ink-muted hover:text-ink text-sm font-sans font-medium transition-colors duration-300 pb-0.5"
              >
                Reports
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden sm:block text-sm text-ink-muted font-sans">
              {user?.username || "Developer"}
            </span>
            <button
              onClick={handleSignOut}
              className="text-ink-muted hover:text-ink transition-colors duration-300 text-sm font-sans"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto px-6 lg:px-10 py-12 lg:py-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Editorial */}
        <section className="lg:col-span-5 space-y-12 lg:sticky lg:top-24 animate-enter-up">
          <div className="space-y-5">
            <p className="text-terra text-xs font-sans font-medium tracking-[0.2em] uppercase">
              Readiness Engine
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-ink leading-[1.15]">
              Bridge the gap<br />
              to your <span className="text-terra italic">next role</span>.
            </h2>
            <p className="text-ink-muted text-sm leading-relaxed max-w-sm font-sans font-light">
              Upload your resume and the job specification. We parse the
              criteria, compare your background, spotlight skill gaps, and
              build a custom preparation guide.
            </p>
          </div>

          {/* How It Works */}
          <div className="space-y-6 animate-enter delay-300">
            <h3 className="text-xs font-sans font-medium text-ink-muted tracking-[0.2em] uppercase">
              How it works
            </h3>
            <div className="space-y-5">
              {[
                {
                  step: "01",
                  title: "Upload your PDF resume",
                  desc: "We parse your projects, tech stack, and experience.",
                },
                {
                  step: "02",
                  title: "Paste the job description",
                  desc: "Provide the role requirements you're targeting.",
                },
                {
                  step: "03",
                  title: "Get your readiness package",
                  desc: "Score, questions, answers, and study roadmaps — instantly.",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-5 group">
                  <span className="font-serif text-2xl text-ink-ghost group-hover:text-terra transition-colors duration-400 leading-none shrink-0">
                    {s.step}
                  </span>
                  <div className="border-l border-border pl-5">
                    <h4 className="text-sm font-sans font-medium text-ink">
                      {s.title}
                    </h4>
                    <p className="text-xs text-ink-muted font-sans font-light mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Form */}
        <section className="lg:col-span-7 animate-enter-up delay-200">
          <div className="bg-surface border border-border rounded-lg p-8 lg:p-10">
            <h2 className="font-serif text-2xl text-ink mb-8">
              Create Preparation Plan
            </h2>

            {error && (
              <div className="mb-6 py-2.5 px-4 bg-warm-red-ghost border-l-2 border-warm-red text-warm-red text-sm flex items-start gap-3">
                <span className="font-sans text-xs">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Resume Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-sans font-medium text-ink-muted tracking-wide uppercase">
                  Resume <span className="text-terra">*</span>
                </label>

                {!resumeFile ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border border-dashed rounded-md p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${
                      isDragActive
                        ? "border-terra bg-terra-ghost"
                        : "border-border-hover hover:border-ink-ghost bg-parchment-dim/50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <svg className="w-6 h-6 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 3 3 0 013.898 3.345A3.75 3.75 0 0118 19.5H6.75z" />
                    </svg>
                    <div className="text-center">
                      <p className="text-sm font-sans text-ink-light">
                        Drop your resume here, or{" "}
                        <span className="text-terra font-medium">browse</span>
                      </p>
                      <p className="text-xs text-ink-muted font-sans mt-1">
                        PDF files only
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-3 px-4 rounded-md bg-parchment-dim border border-border flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <svg className="w-4 h-4 text-terra shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <div className="min-w-0">
                        <p className="text-sm font-sans font-medium text-ink truncate">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-ink-muted font-sans mt-0.5">
                          {formatFileSize(resumeFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1 hover:bg-border-light rounded text-ink-muted hover:text-ink transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <label className="block text-xs font-sans font-medium text-ink-muted tracking-wide uppercase">
                  Target Job Description <span className="text-terra">*</span>
                </label>
                <textarea
                  rows={5}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="block w-full py-3 border-0 border-b border-border bg-transparent text-ink placeholder-ink-ghost focus:outline-none focus:border-terra transition-colors duration-300 font-sans text-sm resize-y"
                  placeholder="Paste the job description, key requirements, roles and responsibilities..."
                />
              </div>

              {/* Self Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-sans font-medium text-ink-muted tracking-wide uppercase">
                    Self Description
                  </label>
                  <span className="text-xs text-ink-ghost font-sans italic">Optional</span>
                </div>
                <textarea
                  rows={3}
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  className="block w-full py-3 border-0 border-b border-border bg-transparent text-ink placeholder-ink-ghost focus:outline-none focus:border-terra transition-colors duration-300 font-sans text-sm resize-y"
                  placeholder="Highlight specific career achievements, skills, or focus areas..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-terra hover:bg-terra-hover text-white font-sans font-medium py-3.5 rounded-md transition-all duration-300 active:scale-[0.98] text-sm tracking-wide"
              >
                Generate Preparation Plan
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-parchment/95 backdrop-blur-sm">
          <div className="max-w-md w-full px-6 flex flex-col items-center text-center">
            {/* Pulsing dots */}
            <div className="flex items-center gap-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot delay-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot delay-400" />
            </div>

            <h3 className="font-serif text-2xl text-ink mb-2">
              Analyzing Profile
            </h3>

            {/* Current step */}
            <div className="h-10 flex items-center justify-center mb-8">
              <p className="text-terra text-sm font-sans font-medium animate-pulse">
                {loadingSteps[loadingStep]}
              </p>
            </div>

            {/* Step list */}
            <div className="w-full bg-surface border border-border rounded-lg p-5 text-left space-y-3">
              {loadingSteps.map((stepMsg, idx) => {
                const isCompleted = idx < loadingStep;
                const isActive = idx === loadingStep;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 transition-opacity duration-300"
                  >
                    {isCompleted ? (
                      <svg className="w-3.5 h-3.5 text-sage shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : isActive ? (
                      <svg className="w-3.5 h-3.5 text-terra animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-border-hover shrink-0" />
                    )}
                    <span
                      className={`text-xs font-sans ${
                        isCompleted
                          ? "text-ink-ghost line-through"
                          : isActive
                            ? "text-terra font-medium"
                            : "text-ink-faint"
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
