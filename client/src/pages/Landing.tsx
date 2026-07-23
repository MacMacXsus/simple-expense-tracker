import React from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden text-slate-800 font-sans">
      {/* ================= SHARED LANDING BACKGROUND ================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-slate-50/80 to-slate-50" />

        {/* Top-Left Blue Glow (Extends behind the Navbar) */}
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-blue-400/25 rounded-full blur-3xl" />

        {/* Right Ambient Glow */}
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl" />

        {/* Bottom Ambient Glow */}
        <div className="absolute -bottom-20 left-1/3 w-[500px] h-80 bg-indigo-200/20 rounded-full blur-3xl" />

        {/* Subtle Dot Grid */}
        {/* <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        /> */}
      </div>

      {/* ================= PAGE CONTENT LAYER ================= */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 1. Header sits directly above hero within same background context */}
        <LandingNavbar />

        {/* 2. Hero Content */}
        <main className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1">
          {/* Left Column: Hero Text & Actions */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Take Control of Your Spending.{" "}
              <span className="text-blue-600">Effortlessly.</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Track every expense, manage your budget, and achieve your
              financial goals with our simple, user-friendly expense tracker.
              Built for clarity.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
              >
                Get Started For Free
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-sm transition-all"
              >
                Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-slate-200/80 mt-4 flex items-center gap-4">
              <div className="bg-slate-200/80 text-slate-600 font-bold px-3 py-1.5 rounded-md text-xs uppercase tracking-wider">
                MockLogos
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Trusted by thousands
                </p>
                <p className="text-xs text-slate-500">
                  Trusted by 50,000+ users managing their finances.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard Mockup */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden p-2">
              {/* Mock Browser Bar */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100/80 rounded-t-xl mb-2">
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full"></span>
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
              </div>

              {/* Preview Box */}
              <div className="w-full h-72 md:h-96 bg-slate-50/50 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mb-2 stroke-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-sm font-medium text-slate-500">
                  [ Dashboard Preview Content ]
                </p>
              </div>
            </div>
          </div>
        </main>
        {/* Footer at the bottom */}
        <LandingFooter />
      </div>
    </div>
  );
}
