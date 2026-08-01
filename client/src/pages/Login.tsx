import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Local image import with direct CDN fallback
// import landingBg from "../assets/landing-bg.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const heroBgUrl =
    // landingBg ||
    "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to log in");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAF8] font-sans text-slate-800">
      {/* ================= LEFT SIDEBAR (FORM) ================= */}
      <div className="w-full lg:w-[460px] xl:w-[500px] flex flex-col justify-between p-8 sm:p-12 z-10 bg-[#F8FAF8] border-r border-slate-200/60">
        {/* Logo Header */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-lg text-slate-900 tracking-tight"
          >
            <div className="bg-[#1B5E20] text-white w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-sm shadow-sm">
              $
            </div>
            <span>Trackily</span>
          </Link>
        </div>

        {/* Main Content Form */}
        <div className="my-auto py-8 w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to your Trackily account.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-6 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-100/80 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-100/80 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-[#1B5E20] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#1B5E20] hover:bg-[#144718] text-white font-semibold text-sm rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer mt-2"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-8">
            No account?{" "}
            <Link
              to="/register"
              className="font-bold text-[#1B5E20] hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-400 text-center sm:text-left">
          © {new Date().getFullYear()} Trackily. All rights reserved.
        </div>
      </div>

      {/* ================= RIGHT HERO BANNER ================= */}
      <div className="hidden lg:flex flex-1 relative bg-slate-950 overflow-hidden items-end p-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url('${heroBgUrl}')` }}
        />
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[0.5px]" />

        {/* Quote Overlay */}
        <div className="relative z-10 max-w-lg text-white/90">
          <blockquote className="space-y-2">
            <p className="text-sm font-medium leading-relaxed text-slate-200">
              "A budget is telling your money where to go instead of wondering
              where it went."
            </p>
            <footer className="text-xs text-slate-400 font-medium">
              — Dave Ramsey
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}