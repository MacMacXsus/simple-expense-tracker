import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Local image import with direct CDN fallback
// import landingBg from "../assets/landing-bg.png";

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const heroBgUrl =
    // landingBg ||
    "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop";

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");

      setMessage("An OTP code has been sent to your email.");
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to reset password");

      alert("Password updated successfully! Redirecting to login...");
      navigate("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
              {step === 1 ? "Forgot Password" : "Enter Reset Code"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {step === 1
                ? "Enter your email to receive a verification code."
                : `Enter the code sent to ${email} and set your new password.`}
            </p>
          </div>

          {error && (
            <div className="p-3 mb-6 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 mb-6 text-xs font-medium text-[#1B5E20] bg-[#E8F5E9] border border-[#A5D6A7]/60 rounded-lg">
              {message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#1B5E20] hover:bg-[#144718] text-white font-semibold text-sm rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer mt-2"
              >
                {isSubmitting ? "Sending OTP..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-100/80 border border-slate-200 rounded-lg text-sm text-center font-mono tracking-widest text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all"
                  placeholder="123456"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-100/80 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#1B5E20] hover:bg-[#144718] text-white font-semibold text-sm rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer mt-2"
              >
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs text-slate-500 hover:underline text-center block pt-1"
              >
                Didn't receive a code? Try again
              </button>
            </form>
          )}

          <p className="text-center text-xs text-slate-500 mt-8">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-bold text-[#1B5E20] hover:underline"
            >
              Sign in
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