import React, { useEffect } from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { useNavigate, useLocation } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to section if redirected from another page (e.g. Terms & Conditions / Privacy Policy)
  useEffect(() => {
    const targetId = location.state?.scrollTo;
    if (targetId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const heroBgUrl =
    "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans text-slate-800 scroll-smooth">
      {/* Navbar */}
      <LandingNavbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex flex-col justify-between bg-[#0B1E11] overflow-hidden">
        {/* Dark Forest Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('${heroBgUrl}')`,
          }}
        />

        {/* Dark Vignette & Color Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950/90 backdrop-blur-[0.5px]" />

        {/* Hero Main Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 max-w-4xl mx-auto">
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
        <a
          href="#features"
          className="relative z-10 pb-8 flex flex-col items-center justify-center text-slate-400 hover:text-white transition-colors text-[10px] tracking-widest font-semibold uppercase gap-2 cursor-pointer"
        >
          <span>SCROLL</span>
          <div className="w-0.5 h-6 bg-gradient-to-b from-slate-400 to-transparent rounded-full" />
        </a>
      </section>

      {/* ================= 1. FEATURES SECTION ================= */}
      <section id="features" className="py-24 px-6 bg-slate-50 border-t border-slate-200/80 scroll-mt-12">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider">
              Powerful Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
              Everything you need to master your money
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              Designed specifically for fast, zero-friction individual expense management.
            </p>
          </div>

          {/* Mock Dashboard Window */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200 text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-400/80 rounded-full" />
                <span className="w-3 h-3 bg-amber-400/80 rounded-full" />
                <span className="w-3 h-3 bg-emerald-400/80 rounded-full" />
              </div>
              <span className="ml-4 text-slate-400">trackily / dashboard</span>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#E8F5E9] border border-[#A5D6A7]/50 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-medium text-slate-600">Total Spent</span>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-slate-900">$39.50</p>
                  <span className="text-xs font-semibold text-[#1B5E20]">↗ Logged (This Month)</span>
                </div>
              </div>

              <div className="bg-[#E8F5E9] border border-[#A5D6A7]/50 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-medium text-slate-600">Monthly Budget</span>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-slate-900">$100.00</p>
                  <span className="text-xs font-semibold text-[#1B5E20]">$60.50 remaining</span>
                </div>
              </div>

              <div className="bg-[#E8F5E9] border border-[#A5D6A7]/50 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-medium text-slate-600">Budget Usage</span>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-slate-900">40%</p>
                  <span className="text-xs font-semibold text-[#1B5E20]">On track</span>
                </div>
              </div>

              <div className="bg-[#E8F5E9] border border-[#A5D6A7]/50 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-medium text-slate-600">Transactions</span>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-slate-900">6</p>
                  <span className="text-xs font-semibold text-slate-500">Items logged</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7]/50 flex items-center justify-center text-[#1B5E20]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Instant Expense Logging</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Log expenses in seconds with titles, amounts, custom dates, and categories. Simple and frictionless.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7]/50 flex items-center justify-center text-[#1B5E20]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Flexible Date Filters</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Filter your dashboard by Today, This Month, All Time, specific date, or custom range effortlessly.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7]/50 flex items-center justify-center text-[#1B5E20]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Budget Progress & Analytics</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real-time visual progress bars keep you on budget and highlight high-spending categories instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. PRICING SECTION ================= */}
      <section id="pricing" className="py-24 px-6 bg-white border-t border-slate-200/80 scroll-mt-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider">
              Simple Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
              Always free for personal use
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              No hidden fees, no credit card required, and no intrusive ads.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-50 rounded-2xl border-2 border-[#1B5E20] p-8 flex flex-col justify-between relative shadow-sm">
              <div className="absolute -top-3 right-6 bg-[#1B5E20] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Personal Starter</h3>
                <p className="text-xs text-slate-500 mt-1">Perfect for individuals tracking daily spending.</p>
                
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-xs text-slate-500 font-medium">/ forever</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="text-[#1B5E20] font-bold">✓</span> Unlimited expense logging
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#1B5E20] font-bold">✓</span> Real-time budget progress bar
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#1B5E20] font-bold">✓</span> Category & date range filters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#1B5E20] font-bold">✓</span> Secure session authentication
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate("/register")}
                className="mt-8 w-full py-3 rounded-xl bg-[#1B5E20] hover:bg-[#144718] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Get started free ↗
              </button>
            </div>

            {/* Pro / Supporter Plan */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pro Supporter</h3>
                <p className="text-xs text-slate-500 mt-1">For power users who want advanced exports.</p>
                
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$4.99</span>
                  <span className="text-xs text-slate-500 font-medium">/ month</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="text-[#1B5E20] font-bold">✓</span> Everything in Starter plan
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#1B5E20] font-bold">✓</span> CSV & PDF expense exports
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#1B5E20] font-bold">✓</span> Custom category icons & themes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#1B5E20] font-bold">✓</span> Priority customer support
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate("/register")}
                className="mt-8 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. ABOUT US SECTION ================= */}
      <section id="about" className="py-24 px-6 bg-slate-50 border-t border-slate-200/80 scroll-mt-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#1B5E20] uppercase tracking-wider">
              About Trackily
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
              Built for simplicity and financial clarity
            </h2>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
            <p>
              <strong className="text-slate-900">Trackily</strong> was created with a single vision: to eliminate the friction of personal financial management. Most budgeting apps are bloated with unnecessary tools, complex bank integrations, or hidden paywalls.
            </p>

            <p>
              We believe managing your personal finances should be fast, private, and rewarding. With Trackily, you get a clean dashboard, real-time spending insights, and full control over your budget without clutter.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 mt-0.5">Privacy Focused</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-slate-900">0s</p>
                <p className="text-xs text-slate-500 mt-0.5">Setup Delay</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-[#1B5E20]">Clean UX</p>
                <p className="text-xs text-slate-500 mt-0.5">Designed for speed</p>
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