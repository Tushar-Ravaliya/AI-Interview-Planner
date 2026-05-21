import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { getUserReports, deleteReport } from "../api/interview.api";
import type { InterviewReport } from "../api/interview.api";
import { 
  BrainCircuit, 
  Search, 
  Trash2, 
  Calendar, 
  ArrowRight, 
  LogOut, 
  Plus, 
  FileQuestion, 
  Loader2, 
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";

export default function Reports() {
  const { handleSignOut } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState<InterviewReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getUserReports();
        setReports(data);
      } catch (err: any) {
        setError(err || "Failed to load your interview history.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      setError(err || "Failed to delete report. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
    if (score >= 60) return "text-amber-400 border-amber-500/30 bg-amber-500/5";
    return "text-rose-400 border-rose-500/30 bg-rose-500/5";
  };

  // Filter reports by job title
  const filteredReports = reports.filter((report) => 
    report.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden pb-16">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-fuchsia-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

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
            to="/"
            className="text-slate-400 hover:text-white transition-colors text-sm font-semibold"
          >
            Dashboard
          </Link>
          <span className="text-indigo-500 text-sm font-semibold">•</span>
          <span className="text-indigo-400 text-sm font-semibold">My Reports</span>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all text-sm font-medium ml-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-12 flex-1 flex flex-col">
        {/* Banner */}
        <section className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Interview Reports</h1>
            <p className="text-slate-400 text-sm mt-1">Review, manage, and access all your past target role readiness analyses.</p>
          </div>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Plan</span>
          </Link>
        </section>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Search / Filters */}
        {reports.length > 0 && (
          <div className="mb-8 max-w-md relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-3 py-3 border border-slate-800 bg-slate-900/30 rounded-xl text-white placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
              placeholder="Search reports by job title..."
            />
          </div>
        )}

        {/* Reports Grid */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-slate-500 text-sm">Loading reports...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div 
                key={report._id}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 hover:border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all group"
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <span className="text-[10px] text-slate-500 font-semibold tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>

                    {/* Delete handler */}
                    {deleteConfirmId === report._id ? (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={deletingId === report._id}
                          onClick={() => handleDelete(report._id)}
                          className="text-[10px] bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          {deletingId === report._id ? "Deleting..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-[10px] bg-slate-850 hover:bg-slate-800 text-slate-400 px-2 py-1 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(report._id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Title & match */}
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors truncate mb-3">
                    {report.title || "Target Interview Plan"}
                  </h3>

                  {/* Report details grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-950/40 p-3.5 border border-slate-850/60 rounded-xl">
                    <div className="space-y-0.5 text-center border-r border-slate-850/50">
                      <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Match Score</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border mt-1 ${getScoreColor(report.matchScore)}`}>
                        {report.matchScore}%
                      </span>
                    </div>
                    <div className="space-y-0.5 text-center">
                      <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Prep Days</span>
                      <span className="block text-sm font-bold text-slate-200 mt-1.5 flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        {report.preparationPlan?.length || 0} Days
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 mb-6 font-sans">
                    <div className="flex justify-between">
                      <span>Practice questions:</span>
                      <span className="text-slate-200 font-semibold">
                        {(report.technicalQuestions?.length || 0) + (report.behavioralQuestions?.length || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Missing skill gaps:</span>
                      <span className={`font-semibold ${report.skillGaps?.length > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                        {report.skillGaps?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View details button */}
                <button
                  onClick={() => navigate(`/interview/${report._id}`)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-300 font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>Open Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-3xl text-center">
            <Search className="w-10 h-10 text-slate-600 mb-3" />
            <h4 className="text-base font-bold text-white">No Matching Reports</h4>
            <p className="text-slate-400 text-xs mt-1">We couldn't find any reports matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-3xl text-center max-w-lg mx-auto">
            <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-4">
              <FileQuestion className="w-8 h-8 text-indigo-400" />
            </div>
            <h4 className="text-lg font-bold text-white">No Reports Generated Yet</h4>
            <p className="text-slate-400 text-sm mt-1 max-w-sm">
              Create your first customized interview readiness assessment and preparation plan using the engine generator.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/10 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create First Plan</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
