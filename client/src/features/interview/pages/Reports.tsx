import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { getUserReports, deleteReport } from "../api/interview.api";
import type { InterviewReport } from "../api/interview.api";
import {
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
  Sparkles,
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
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-gold";
    return "text-danger-soft";
  };

  // Filter reports by job title
  const filteredReports = reports.filter((report) =>
    report.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="relative min-h-screen bg-noir-950 text-bone flex flex-col overflow-hidden pb-16">
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
              className="text-noir-400 hover:text-bone text-sm font-body font-medium transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left pb-0.5"
            >
              Dashboard
            </Link>
            <Link
              to="/reports"
              className="text-bone text-sm font-body font-medium relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-gold after:scale-x-100 after:origin-left pb-0.5"
            >
              Reports
            </Link>
          </nav>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-noir-400 hover:text-bone transition-colors duration-300 text-sm font-body"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-10 mt-12 flex-1 flex flex-col">
        {/* Banner */}
        <section className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gold" />
              <span className="text-gold text-xs font-body font-semibold tracking-[0.25em] uppercase">
                Archive
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-bone tracking-tight">
              Your Reports
            </h1>
            <p className="text-noir-400 text-sm font-body font-light mt-2 max-w-md">
              Review, manage, and revisit all your past interview readiness analyses.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gold hover:bg-gold-light text-noir-950 text-sm font-body font-semibold rounded-sm transition-all duration-300 tracking-wide uppercase shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Plan</span>
          </Link>
        </section>

        {error && (
          <div className="mb-8 py-3 px-4 bg-danger/10 border-l-2 border-danger text-danger-soft text-sm flex items-start gap-3 font-body">
            <AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Search */}
        {reports.length > 0 && (
          <div className="mb-8 max-w-sm relative group animate-fade-in delay-200">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-noir-500 group-focus-within:text-gold transition-colors duration-300" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-7 pr-0 py-3 border-0 border-b border-noir-700 bg-transparent text-bone placeholder-noir-500 focus:outline-none focus:border-gold transition-colors duration-300 text-sm font-body"
              placeholder="Search by job title..."
            />
          </div>
        )}

        {/* Reports Grid */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 text-gold animate-spin" />
            <p className="text-noir-400 text-sm font-body">Loading reports...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in delay-300">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-noir-900 border border-noir-800 hover:border-noir-700 rounded-sm flex flex-col justify-between transition-all duration-300 group relative overflow-hidden"
              >
                {/* Gold top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-gold via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-6">
                  {/* Top row */}
                  <div className="flex justify-between items-start gap-3 mb-5">
                    <span className="text-[10px] text-noir-500 font-body tracking-[0.15em] flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>

                    {/* Delete handler */}
                    {deleteConfirmId === report._id ? (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={deletingId === report._id}
                          onClick={() => handleDelete(report._id)}
                          className="text-[10px] bg-danger hover:bg-danger-soft text-bone font-body font-bold px-2.5 py-1 rounded-sm transition-colors duration-200 disabled:opacity-50 uppercase tracking-wide"
                        >
                          {deletingId === report._id ? "..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-[10px] text-noir-400 hover:text-bone font-body px-2 py-1 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(report._id)}
                        className="text-noir-600 hover:text-danger-soft p-1 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-base font-bold text-bone leading-snug group-hover:text-gold-light transition-colors duration-300 truncate mb-5">
                    {report.title || "Interview Plan"}
                  </h3>

                  {/* Stats strip */}
                  <div className="flex items-stretch border border-noir-800 divide-x divide-noir-800 rounded-sm mb-5">
                    <div className="flex-1 py-3 text-center">
                      <div className="text-[10px] text-noir-500 font-body tracking-[0.15em] uppercase mb-1">Score</div>
                      <span className={`font-display text-lg font-bold ${getScoreColor(report.matchScore)}`}>
                        {report.matchScore}%
                      </span>
                    </div>
                    <div className="flex-1 py-3 text-center">
                      <div className="text-[10px] text-noir-500 font-body tracking-[0.15em] uppercase mb-1">Prep</div>
                      <span className="font-body text-sm font-semibold text-bone flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-gold" />
                        {report.preparationPlan?.length || 0}d
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs font-body text-noir-400 mb-5">
                    <div className="flex justify-between">
                      <span>Questions</span>
                      <span className="text-bone font-medium">
                        {(report.technicalQuestions?.length || 0) +
                          (report.behavioralQuestions?.length || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skill gaps</span>
                      <span
                        className={`font-medium ${report.skillGaps?.length > 0 ? "text-gold" : "text-success"}`}
                      >
                        {report.skillGaps?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View button */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => navigate(`/interview/${report._id}`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-noir-700 hover:border-gold/40 bg-transparent hover:bg-gold/5 text-noir-300 hover:text-gold font-body font-medium text-xs transition-all duration-300 active:scale-[0.98] cursor-pointer rounded-sm tracking-wide uppercase"
                  >
                    <span>Open Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-8 h-8 text-noir-600 mb-4" />
            <h4 className="font-display text-base font-bold text-bone">
              No Matching Reports
            </h4>
            <p className="text-noir-400 text-xs font-body mt-1">
              No reports matching "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <FileQuestion className="w-8 h-8 text-noir-600 mb-4" />
            <h4 className="font-display text-lg font-bold text-bone">
              No Reports Yet
            </h4>
            <div className="w-10 h-px bg-gold mx-auto my-4" />
            <p className="text-noir-400 text-sm font-body font-light max-w-sm">
              Create your first interview readiness assessment and preparation plan.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-noir-950 text-xs font-body font-semibold rounded-sm transition-all duration-300 tracking-wide uppercase"
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
