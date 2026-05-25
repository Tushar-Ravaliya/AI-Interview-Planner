import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { getUserReports, deleteReport } from "../api/interview.api";
import type { InterviewReport } from "../api/interview.api";

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
    if (score >= 80) return "text-sage";
    if (score >= 60) return "text-amber";
    return "text-warm-red";
  };

  // Filter reports by job title
  const filteredReports = reports.filter((report) =>
    report.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-parchment text-ink flex flex-col pb-16">
      {/* Header */}
      <header className="w-full border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-serif text-xl text-ink">Intervuo</h1>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-ink-muted hover:text-ink text-sm font-sans font-medium transition-colors duration-300 pb-0.5"
              >
                Dashboard
              </Link>
              <Link
                to="/reports"
                className="text-ink text-sm font-sans font-medium border-b border-terra pb-0.5"
              >
                Reports
              </Link>
            </nav>
          </div>

          <button
            onClick={handleSignOut}
            className="text-ink-muted hover:text-ink transition-colors duration-300 text-sm font-sans"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto px-6 lg:px-10 mt-12 flex-1 flex flex-col">
        {/* Banner */}
        <section className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 animate-enter-up">
          <div>
            <p className="text-terra text-xs font-sans font-medium tracking-[0.2em] uppercase mb-4">
              Archive
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink">
              Your Reports
            </h2>
            <p className="text-ink-muted text-sm font-sans font-light mt-2 max-w-md">
              Review, manage, and revisit all your past interview readiness analyses.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-terra hover:bg-terra-hover text-white text-sm font-sans font-medium rounded-md transition-all duration-300 tracking-wide shrink-0"
          >
            + New Plan
          </Link>
        </section>

        {error && (
          <div className="mb-8 py-2.5 px-4 bg-warm-red-ghost border-l-2 border-warm-red text-warm-red text-sm flex items-start gap-3 font-sans">
            <span className="text-xs">{error}</span>
          </div>
        )}

        {/* Search */}
        {reports.length > 0 && (
          <div className="mb-8 max-w-sm animate-enter delay-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full py-2.5 border-0 border-b border-border bg-transparent text-ink placeholder-ink-ghost focus:outline-none focus:border-terra transition-colors duration-300 text-sm font-sans"
              placeholder="Search by job title..."
            />
          </div>
        )}

        {/* Reports Grid */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot delay-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot delay-400" />
            </div>
            <p className="text-ink-muted text-sm font-sans">Loading reports...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-enter delay-300">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="bg-surface border border-border hover:border-border-hover rounded-lg flex flex-col justify-between transition-all duration-300 group hover:shadow-sm"
              >
                <div className="p-6">
                  {/* Top row */}
                  <div className="flex justify-between items-start gap-3 mb-5">
                    <span className="text-[10px] text-ink-faint font-sans tracking-[0.1em]">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>

                    {/* Delete handler */}
                    {deleteConfirmId === report._id ? (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={deletingId === report._id}
                          onClick={() => handleDelete(report._id)}
                          className="text-[10px] bg-warm-red hover:bg-warm-red/90 text-white font-sans font-semibold px-2.5 py-1 rounded transition-colors duration-200 disabled:opacity-50 uppercase tracking-wide"
                        >
                          {deletingId === report._id ? "..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-[10px] text-ink-muted hover:text-ink font-sans px-2 py-1 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(report._id)}
                        className="text-ink-ghost hover:text-warm-red p-1 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-base text-ink leading-snug group-hover:text-terra transition-colors duration-300 truncate mb-5">
                    {report.title || "Interview Plan"}
                  </h3>

                  {/* Stats strip */}
                  <div className="flex items-stretch border border-border divide-x divide-border rounded-md mb-5">
                    <div className="flex-1 py-3 text-center">
                      <div className="text-[10px] text-ink-faint font-sans tracking-[0.1em] uppercase mb-1">Score</div>
                      <span className={`font-serif text-lg ${getScoreColor(report.matchScore)}`}>
                        {report.matchScore}%
                      </span>
                    </div>
                    <div className="flex-1 py-3 text-center">
                      <div className="text-[10px] text-ink-faint font-sans tracking-[0.1em] uppercase mb-1">Prep</div>
                      <span className="font-sans text-sm font-medium text-ink">
                        {report.preparationPlan?.length || 0}d
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs font-sans text-ink-muted mb-5">
                    <div className="flex justify-between">
                      <span>Questions</span>
                      <span className="text-ink font-medium">
                        {(report.technicalQuestions?.length || 0) +
                          (report.behavioralQuestions?.length || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skill gaps</span>
                      <span
                        className={`font-medium ${report.skillGaps?.length > 0 ? "text-amber" : "text-sage"}`}
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
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-border hover:border-terra/30 bg-transparent hover:bg-terra-ghost text-ink-muted hover:text-terra font-sans font-medium text-xs transition-all duration-300 active:scale-[0.98] cursor-pointer rounded-md tracking-wide"
                  >
                    Open Report →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <svg className="w-6 h-6 text-ink-ghost mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <h4 className="font-serif text-base text-ink">
              No Matching Reports
            </h4>
            <p className="text-ink-muted text-xs font-sans mt-1">
              No reports matching "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <svg className="w-6 h-6 text-ink-ghost mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <h4 className="font-serif text-lg text-ink">
              No Reports Yet
            </h4>
            <div className="w-8 h-px bg-terra mx-auto my-4" />
            <p className="text-ink-muted text-sm font-sans font-light max-w-sm">
              Create your first interview readiness assessment and preparation plan.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-terra hover:bg-terra-hover text-white text-xs font-sans font-medium rounded-md transition-all duration-300 tracking-wide"
            >
              Create First Plan
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
