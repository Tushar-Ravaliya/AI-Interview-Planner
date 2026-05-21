import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import Loader from "../components/Loader.tsx";

export default function SignIn() {
  const { loading, handleSignIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await handleSignIn(email, password);
      if (data) {
        navigate("/");
      }
    } catch (error) {
      setError(error as string);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="relative min-h-screen flex bg-noir-950 overflow-hidden">
      {/* Noise grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px"}} />

      {/* Left Panel — Typographic Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 xl:p-16 bg-noir-900 border-r border-noir-700/50">
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

        <div className="relative z-10">
          <span className="text-gold text-xs font-body font-semibold tracking-[0.3em] uppercase">
            Intervuo
          </span>
        </div>

        <div className="relative z-10 space-y-8 animate-fade-in-up">
          <h1 className="font-display text-6xl xl:text-7xl font-bold text-bone leading-[1.1] tracking-tight">
            Prepare.<br />
            <span className="text-gold italic">Perform.</span><br />
            Prevail.
          </h1>
          <div className="w-16 h-px bg-gold" />
          <p className="text-bone-muted text-base leading-relaxed max-w-sm font-body font-light">
            AI-powered interview preparation that analyzes your profile against
            target roles and builds a custom readiness package.
          </p>
        </div>

        <div className="relative z-10 text-noir-500 text-xs font-body tracking-wide">
          © {new Date().getFullYear()} Intervuo AI
        </div>
      </div>

      {/* Right Panel — Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-sm animate-fade-in-up delay-200">
          {/* Mobile brand */}
          <div className="lg:hidden mb-12">
            <span className="text-gold text-xs font-body font-semibold tracking-[0.3em] uppercase">
              Intervuo
            </span>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-3xl font-bold text-bone tracking-tight">
              Welcome back
            </h2>
            <p className="text-bone-muted mt-3 text-sm font-light">
              Sign in to continue your interview preparation.
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-body font-medium text-bone-muted tracking-wide uppercase">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-noir-400 hover:text-gold transition-colors duration-300"
                  >
                    Forgot?
                  </a>
                </div>
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
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-noir-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-gold hover:text-gold-light transition-colors duration-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
