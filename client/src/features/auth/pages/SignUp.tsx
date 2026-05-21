import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import Loader from "../components/Loader";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { loading, handleSignUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await handleSignUp(username, email, password);
      if (data) {
        navigate("/");
      }
    } catch (error) {
      setError(error as string);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="relative min-h-screen flex bg-noir-950 overflow-hidden">
      {/* Noise grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px"}} />

      {/* Left Panel — Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-sm animate-fade-in-up">
          {/* Mobile brand */}
          <div className="lg:hidden mb-12">
            <span className="text-gold text-xs font-body font-semibold tracking-[0.3em] uppercase">
              Intervuo
            </span>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold text-bone tracking-tight">
              Create account
            </h2>
            <p className="text-bone-muted mt-3 text-sm font-light">
              Start building your interview readiness today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="py-3 px-4 bg-danger/10 border-l-2 border-danger text-danger-soft text-xs">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="group">
                <label className="block text-xs font-body font-medium text-bone-muted mb-2 tracking-wide uppercase">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-noir-500 group-focus-within:text-gold transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-7 pr-0 py-3 border-0 border-b border-noir-700 bg-transparent text-bone placeholder-noir-500 focus:outline-none focus:border-gold transition-colors duration-300 text-sm font-body"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-body font-medium text-bone-muted mb-2 tracking-wide uppercase">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-noir-500 group-focus-within:text-gold transition-colors duration-300" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-7 pr-0 py-3 border-0 border-b border-noir-700 bg-transparent text-bone placeholder-noir-500 focus:outline-none focus:border-gold transition-colors duration-300 text-sm font-body"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-body font-medium text-bone-muted mb-2 tracking-wide uppercase">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-noir-500 group-focus-within:text-gold transition-colors duration-300" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-7 pr-0 py-3 border-0 border-b border-noir-700 bg-transparent text-bone placeholder-noir-500 focus:outline-none focus:border-gold transition-colors duration-300 text-sm font-body"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-gold hover:bg-gold-light text-noir-950 font-body font-semibold py-3.5 px-4 rounded-sm transition-all duration-300 active:scale-[0.98] text-sm tracking-wide uppercase"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-noir-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-gold hover:text-gold-light transition-colors duration-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel — Typographic Hero (mirrored from SignIn) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 xl:p-16 bg-noir-900 border-l border-noir-700/50">
        {/* Gold accent line */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

        <div className="relative z-10 flex justify-end">
          <span className="text-gold text-xs font-body font-semibold tracking-[0.3em] uppercase">
            AI
          </span>
        </div>

        <div className="relative z-10 space-y-8 animate-fade-in-up delay-200">
          <h1 className="font-display text-6xl xl:text-7xl font-bold text-bone leading-[1.1] tracking-tight text-right">
            Your edge<br />
            <span className="text-gold italic">starts</span><br />
            here.
          </h1>
          <div className="w-16 h-px bg-gold ml-auto" />
          <p className="text-bone-muted text-base leading-relaxed max-w-sm font-body font-light text-right ml-auto">
            Custom interview questions, skill gap analysis, and a day-by-day
            preparation schedule — all tailored to your exact profile.
          </p>
        </div>

        <div className="relative z-10 text-noir-500 text-xs font-body tracking-wide text-right">
          Powered by advanced language models
        </div>
      </div>
    </div>
  );
}
