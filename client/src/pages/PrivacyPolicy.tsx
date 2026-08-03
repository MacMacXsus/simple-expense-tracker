import React from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <LandingNavbar />

        {/* Hero Header Banner */}
        <section className="relative bg-[#0B1E11] pt-32 pb-20 px-6 overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-[#0B1E11] to-slate-950/90" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1B5E20]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs text-[#A5D6A7] font-medium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#66BB6A]" />
              Legal & Transparency
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Privacy Policy
            </h1>

            {/* Metadata */}
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Last updated: <span className="text-slate-200">July 2026</span>
            </p>
          </div>
        </section>

        {/* Main Content Container */}
        <main className="max-w-4xl mx-auto px-6 -mt-8 pb-20 relative z-10 w-full">
          <div className="bg-white rounded-2xl p-6 sm:p-10 md:p-12 shadow-xl border border-slate-200/80 space-y-10">
            {/* TL;DR Highlight Callout */}
            <div className="bg-[#E8F5E9] border border-[#A5D6A7]/60 rounded-xl p-5 flex items-start gap-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-2 bg-[#1B5E20] text-white rounded-lg shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <strong className="text-slate-900 font-bold block mb-1">
                  Privacy at a Glance
                </strong>
                We store your expense logs securely to generate your personal dashboard insights. We <strong className="text-[#1B5E20]">never</strong> sell, rent, or trade your personal financial data to third parties or advertisers.
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
              {/* Section 1 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#E8F5E9] text-[#1B5E20] font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-[#A5D6A7]/40">
                    01
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Introduction
                  </h2>
                </div>
                <p className="pl-1 sm:pl-9">
                  Welcome to <strong>Trackily</strong>. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our expense tracking services.
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* Section 2 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#E8F5E9] text-[#1B5E20] font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-[#A5D6A7]/40">
                    02
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Information We Collect
                  </h2>
                </div>
                <div className="pl-1 sm:pl-9 space-y-3">
                  <p>
                    We collect information that you provide directly to us when creating an account or logging expenses:
                  </p>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] mt-2 shrink-0" />
                      <span>
                        <strong className="text-slate-900">Account Information:</strong> Name, email address, and login credentials.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] mt-2 shrink-0" />
                      <span>
                        <strong className="text-slate-900">Financial Log Data:</strong> Amounts, categories, dates, and optional notes you input into Trackily.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] mt-2 shrink-0" />
                      <span>
                        <strong className="text-slate-900">Usage Data:</strong> Information on how you interact with our application to help us optimize performance.
                      </span>
                    </li>
                  </ul>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Section 3 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#E8F5E9] text-[#1B5E20] font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-[#A5D6A7]/40">
                    03
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    How We Use Your Information
                  </h2>
                </div>
                <div className="pl-1 sm:pl-9 space-y-3">
                  <p>
                    Your data is strictly used to provide and enhance our financial tracking services:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-[#1B5E20] font-bold">✓</span> To create and maintain your personal Trackily account.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#1B5E20] font-bold">✓</span> To generate financial reports, analytics, and budgeting insights for your personal view.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#1B5E20] font-bold">✓</span> To maintain system security and prevent unauthorized access.
                    </li>
                  </ul>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Section 4 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#E8F5E9] text-[#1B5E20] font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-[#A5D6A7]/40">
                    04
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Data Security & Sharing
                  </h2>
                </div>
                <p className="pl-1 sm:pl-9">
                  We implement industry-standard encryption to protect your expense logs both in transit and at rest. We <strong className="text-slate-900">never</strong> sell, rent, or trade your personal financial data to third parties or advertising networks.
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* Section 5 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#E8F5E9] text-[#1B5E20] font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-[#A5D6A7]/40">
                    05
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Your Rights & Control
                  </h2>
                </div>
                <p className="pl-1 sm:pl-9">
                  You retain full ownership of your data. You can export, edit, or permanently delete your account and all associated expense logs at any time directly through your account settings.
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* Section 6 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#E8F5E9] text-[#1B5E20] font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-[#A5D6A7]/40">
                    06
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Contact Us
                  </h2>
                </div>
                <p className="pl-1 sm:pl-9">
                  If you have any questions or concerns regarding this Privacy Policy, please reach out to us at{" "}
                  <a
                    href="mailto:support@trackily.com"
                    className="text-[#1B5E20] hover:underline font-semibold"
                  >
                    support@trackily.com
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}