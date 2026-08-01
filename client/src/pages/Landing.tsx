import React from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { useNavigate } from "react-router-dom";

// Local image import or fallback URL
// import landingBg from "../../assets/landing-bg.png";

export default function Landing() {
  const navigate = useNavigate();

  // Use imported local image asset with fallback
  const heroBgUrl =
    // landingBg ||
    "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop"; // sample fallback image from Unsplash (testing only)

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex flex-col justify-between bg-[#0B1E11] overflow-hidden">
        {/* Dark Forest Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('${heroBgUrl}')`,
          }}
        />

        {/* Dark Vignette & Color Overlay for High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950/90 backdrop-blur-[0.5px]" />

        {/* Navbar */}
        <LandingNavbar />

        {/* Hero Main Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 font-medium mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse" />
            Free for personal use
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Track every dollar. <br />
            <span className="text-[#66BB6A]">Stay in control.</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-10">
            Trackily gives you a clear, real-time picture of your spending —
            categorized, searchable, and always up to date.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1B5E20] hover:bg-[#144718] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              Start tracking free ↗
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/80 text-slate-200 text-sm font-semibold backdrop-blur-md transition-all border border-slate-700/60 shadow-sm cursor-pointer"
            >
              Sign in to dashboard
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 pb-8 flex flex-col items-center justify-center text-slate-400 text-[10px] tracking-widest font-semibold uppercase gap-2">
          <span>SCROLL</span>
          <div className="w-0.5 h-6 bg-gradient-to-b from-slate-400 to-transparent rounded-full" />
        </div>
      </section>

      {/* ================= PREVIEW & FEATURES SECTION ================= */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Everything at a glance
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Your finances, always one screen away.
            </p>
          </div>

          {/* 1. Mock Dashboard Window */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
            {/* Mock Header Bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200 text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-400/80 rounded-full" />
                <span className="w-3 h-3 bg-amber-400/80 rounded-full" />
                <span className="w-3 h-3 bg-emerald-400/80 rounded-full" />
              </div>
              <span className="ml-4 text-slate-400">trackily / dashboard</span>
            </div>

            {/* Mock Dashboard Content Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat Card 1 */}
              <div className="bg-[#E8F5E9] border border-[#A5D6A7]/50 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-medium text-slate-600">Balance</span>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-slate-900">$12,450</p>
                  <span className="text-xs font-semibold text-[#1B5E20]">↗ +4.2%</span>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-[#E8F5E9] border border-[#A5D6A7]/50 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-medium text-slate-600">Monthly Spend</span>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-slate-900">$4,750</p>
                  <span className="text-xs font-semibold text-rose-700">↘ -8.1%</span>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-[#E8F5E9] border border-[#A5D6A7]/50 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-medium text-slate-600">Income</span>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-slate-900">$5,050</p>
                  <span className="text-xs font-semibold text-[#1B5E20]">↗ +2.3%</span>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-[#E8F5E9] border border-[#A5D6A7]/50 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-medium text-slate-600">Savings Rate</span>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-slate-900">23.7%</p>
                  <span className="text-xs font-semibold text-[#1B5E20]">↗ +1.4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Feature Cards Container */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-hidden">
            {/* Feature 1: Expense Logging */}
            <div className="p-6 sm:p-7 flex flex-col items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] border border-[#A5D6A7]/50 flex items-center justify-center text-[#1B5E20]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Expense logging
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Log expenses manually or import via CSV. Every transaction
                  categorized automatically.
                </p>
              </div>
            </div>

            {/* Feature 2: Spending Trends */}
            <div className="p-6 sm:p-7 flex flex-col items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] border border-[#A5D6A7]/50 flex items-center justify-center text-[#1B5E20]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Spending trends
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Visual breakdowns by category, month, and custom date range.
                  Spot patterns fast.
                </p>
              </div>
            </div>

            {/* Feature 3: Budget Tracking */}
            <div className="p-6 sm:p-7 flex flex-col items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#E8F5E9] border border-[#A5D6A7]/50 flex items-center justify-center text-[#1B5E20]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Budget tracking
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Set limits per category. Get warnings before you overspend —
                  not after.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}