import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { generateReport } from "../api/interview.api";
import {
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
    <div className="relative min-h-screen bg-noir-950 text-bone flex flex-col overflow-hidden">
      {/* Noise grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px"}} />

      {/* Header */}
      <header className="relative z-10 w-full border-b border-noir-800/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-bone tracking-tight">
              Intervuo
            </span>
            <span className="text-gold text-xs font-body font-semibold tracking-[0.2em] uppercase mt-0.5">
              AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-bone text-sm font-body font-medium relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gold after:scale-x-100 after:origin-left pb-0.5"
            >
              Dashboard
            </Link>
            <Link
              to="/reports"
              className="text-noir-400 hover:text-bone text-sm font-body font-medium transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left pb-0.5"
            >
              Reports
            </Link>
          </nav>

          <div className="flex items-center gap-5">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-bone text-sm font-body font-medium">
                {user?.username || "Developer"}
              </span>
              <span className="text-noir-500 text-xs font-body">{user?.email || ""}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-noir-400 hover:text-bone transition-colors duration-300 text-sm font-body"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Hero & Context */}
        <section className="lg:col-span-5 space-y-12 lg:sticky lg:top-24 animate-fade-in-up">
          {/* Hero */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-gold" />
              <span className="text-gold text-xs font-body font-semibold tracking-[0.25em] uppercase">
                Readiness Engine
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-bone leading-[1.1] tracking-tight">
              Bridge the gap<br />
              to your <span className="text-gold italic">next role</span>.
            </h1>
            <p className="text-bone-muted text-sm leading-relaxed max-w-md font-body font-light">
              Upload your resume and the job specification. We parse the
              criteria, compare your background, spotlight skill gaps, and
              build a custom preparation guide.
            </p>
          </div>

          {/* Data Ribbon — Bloomberg-style */}
          <div className="flex items-stretch border border-noir-800 rounded-sm divide-x divide-noir-800 animate-fade-in delay-300">
            <div className="flex-1 py-4 px-5 text-center">
              <div className="font-display text-2xl font-bold text-bone">94<span className="text-gold text-lg">%</span></div>
              <div className="text-noir-400 text-[10px] font-body tracking-[0.15em] uppercase mt-1">Match Accuracy</div>
            </div>
            <div className="flex-1 py-4 px-5 text-center">
              <div className="font-display text-2xl font-bold text-bone">10<span className="text-gold text-lg">×</span></div>
              <div className="text-noir-400 text-[10px] font-body tracking-[0.15em] uppercase mt-1">Faster Prep</div>
            </div>
            <div className="flex-1 py-4 px-5 text-center">
              <div className="font-display text-2xl font-bold text-bone italic">Instant</div>
              <div className="text-noir-400 text-[10px] font-body tracking-[0.15em] uppercase mt-1">Reports</div>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-6 animate-fade-in delay-500">
            <h3 className="text-xs font-body font-semibold text-bone-muted tracking-[0.25em] uppercase">
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
                  <span className="font-display text-3xl font-bold text-noir-700 group-hover:text-gold transition-colors duration-500 leading-none -mt-1 shrink-0">
                    {s.step}
                  </span>
                  <div className="border-l border-noir-800 pl-5">
                    <h4 className="text-sm font-body font-semibold text-bone">
                      {s.title}
                    </h4>
                    <p className="text-xs text-noir-400 font-body font-light mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Form */}
        <section className="lg:col-span-7 animate-fade-in-up delay-200">
          <div className="bg-noir-900 border border-noir-800 rounded-sm p-8 lg:p-10 relative">
            {/* Gold accent top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-gold via-gold/50 to-transparent" />

            <h2 className="font-display text-2xl font-bold text-bone mb-8">
              Create Preparation Plan
            </h2>

            {error && (
              <div className="mb-6 py-3 px-4 bg-danger/10 border-l-2 border-danger text-danger-soft text-sm flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                <span className="font-body">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Resume Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-body font-medium text-bone-muted tracking-wide uppercase">
                  Resume <span className="text-gold">*</span>
                </label>

                {!resumeFile ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border border-dashed rounded-sm p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 ${
                      isDragActive
                        ? "border-gold bg-gold/5"
                        : "border-noir-700 hover:border-noir-500 bg-noir-950/50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-7 h-7 text-noir-500" />
                    <div className="text-center">
                      <p className="text-sm font-body font-medium text-bone">
                        Drag & drop your resume, or{" "}
                        <span className="text-gold">browse</span>
                      </p>
                      <p className="text-xs text-noir-500 font-body mt-1">
                        PDF files only
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 px-5 rounded-sm bg-noir-850 border border-noir-700 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <FileText className="w-5 h-5 text-gold shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-body font-medium text-bone truncate">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-noir-500 font-body mt-0.5">
                          {formatFileSize(resumeFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 hover:bg-noir-700 rounded-sm text-noir-400 hover:text-bone transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <label className="block text-xs font-body font-medium text-bone-muted tracking-wide uppercase">
                  Target Job Description <span className="text-gold">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute top-3.5 left-0 flex items-start pointer-events-none">
                    <Briefcase className="h-4 w-4 text-noir-500 group-focus-within:text-gold transition-colors duration-300" />
                  </div>
                  <textarea
                    rows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="block w-full pl-7 pr-0 py-3 border-0 border-b border-noir-700 bg-transparent text-bone placeholder-noir-500 focus:outline-none focus:border-gold transition-colors duration-300 font-body text-sm resize-y"
                    placeholder="Paste the job description, key requirements, roles/responsibilities here..."
                  />
                </div>
              </div>

              {/* Self Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-body font-medium text-bone-muted tracking-wide uppercase">
                    Self Description
                  </label>
                  <span className="text-xs text-noir-500 font-body italic">Optional</span>
                </div>
                <div className="relative group">
                  <div className="absolute top-3.5 left-0 flex items-start pointer-events-none">
                    <User className="h-4 w-4 text-noir-500 group-focus-within:text-gold transition-colors duration-300" />
                  </div>
                  <textarea
                    rows={3}
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    className="block w-full pl-7 pr-0 py-3 border-0 border-b border-noir-700 bg-transparent text-bone placeholder-noir-500 focus:outline-none focus:border-gold transition-colors duration-300 font-body text-sm resize-y"
                    placeholder="Highlight specific career achievements, skills, or focus areas..."
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-gold hover:bg-gold-light text-noir-950 font-body font-semibold py-4 px-4 rounded-sm transition-all duration-300 active:scale-[0.98] text-sm tracking-wide uppercase"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Preparation Plan</span>
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-noir-950/95 backdrop-blur-sm">
          <div className="max-w-md w-full px-6 flex flex-col items-center text-center">
            {/* Pulsing gold dots */}
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot" />
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot delay-200" />
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot delay-400" />
            </div>

            <h3 className="font-display text-2xl font-bold text-bone mb-2">
              Analyzing Profile
            </h3>

            {/* Current step */}
            <div className="h-10 flex items-center justify-center mb-8">
              <p className="text-gold text-sm font-body font-medium animate-pulse">
                {loadingSteps[loadingStep]}
              </p>
            </div>

            {/* Step list */}
            <div className="w-full bg-noir-900 border border-noir-800 rounded-sm p-5 text-left space-y-3">
              {loadingSteps.map((stepMsg, idx) => {
                const isCompleted = idx < loadingStep;
                const isActive = idx === loadingStep;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 transition-opacity duration-300"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="w-3.5 h-3.5 text-gold animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-noir-700 shrink-0" />
                    )}
                    <span
                      className={`text-xs font-body ${
                        isCompleted
                          ? "text-noir-500 line-through"
                          : isActive
                            ? "text-gold font-medium"
                            : "text-noir-600"
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
