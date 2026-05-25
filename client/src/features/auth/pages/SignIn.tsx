import React, { useState } from "react";
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
    <div className="min-h-screen bg-parchment flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-enter-up">
        {/* Brand */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl text-ink">Intervuo</h1>
          <div className="w-8 h-px bg-terra mx-auto mt-4" />
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-lg p-10">
          <h2 className="font-serif text-2xl text-ink mb-1">Welcome back</h2>
          <p className="text-ink-muted text-sm font-light mb-8">
            Sign in to continue your preparation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="py-2.5 px-4 bg-warm-red-ghost border-l-2 border-warm-red text-warm-red text-xs font-sans">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-sans font-medium text-ink-muted mb-2 tracking-wide uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full py-2.5 border-0 border-b border-border bg-transparent text-ink placeholder-ink-ghost focus:outline-none focus:border-terra transition-colors duration-300 text-sm font-sans"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-sans font-medium text-ink-muted tracking-wide uppercase">
                  Password
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full py-2.5 border-0 border-b border-border bg-transparent text-ink placeholder-ink-ghost focus:outline-none focus:border-terra transition-colors duration-300 text-sm font-sans"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-terra hover:bg-terra-hover text-white font-sans font-medium py-3 rounded-md transition-all duration-300 active:scale-[0.98] text-sm tracking-wide mt-2"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-muted">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-terra hover:text-terra-hover transition-colors duration-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
