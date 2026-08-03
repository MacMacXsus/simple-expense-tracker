import React from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";

export default function TermsAndConditions() {
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
              User Agreement
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Terms &amp; Conditions
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <strong className="text-slate-900 font-bold block mb-1">
                  Terms Summary
                </strong>
                Trackily is a personal finance tool. By using our service, you agree to keep your credentials secure, use the platform lawfully, and acknowledge that Trackily provides informational tools rather than formal advice.
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
                    Acceptance of Terms
                  </h2>
                </div>
                <p className="pl-1 sm:pl-9">
                  By accessing or using <strong>Trackily</strong>, you agree to be bound by these Terms &amp; Conditions. If you do not agree to all of these terms, please do not access or use our services.
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
                    Description of Service
                  </h2>
                </div>
                <p className="pl-1 sm:pl-9">
                  Trackily provides personal finance and expense tracking management tools. We reserve the right to update, modify, or discontinue any feature of the service at any time to improve system stability or user experience.
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* Section 3 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#E8F5E9] text-[#1B5E20] font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-[#A5D6A7]/40">
                    03
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    User Accounts &amp; Security
                  </h2>
                </div>
                <div className="pl-1 sm:pl-9 space-y-3">
                  <p>
                    When you create an account with us, you must provide accurate and complete information:
                  </p>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] mt-2 shrink-0" />
                      <span>You are responsible for maintaining the confidentiality of your account password.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] mt-2 shrink-0" />
                      <span>You are responsible for all activities that occur under your account.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] mt-2 shrink-0" />
                      <span>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</span>
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
                    Acceptable Use
                  </h2>
                </div>
                <p className="pl-1 sm:pl-9">
                  You agree not to use Trackily for any unlawful purpose or to attempt to breach, disrupt, or interfere with our servers, network security, or user data interfaces.
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
                    Intellectual Property
                  </h2>
                </div>
                <p className="pl-1 sm:pl-9">
                  All original content, features, logos, and functionality within Trackily remain the exclusive property of Trackily and its licensors. You may not reproduce or distribute any part of the software without explicit written permission.
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
                    Limitation of Liability
                  </h2>
                </div>
                <p className="pl-1 sm:pl-9">
                  Trackily is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for accuracy and reliability, Trackily is an informational expense tracking tool and does not constitute formal financial, accounting, or tax advice.
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* Section 7 */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#E8F5E9] text-[#1B5E20] font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-[#A5D6A7]/40">
                    07
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Contact Us
                  </h2>
                </div>
                <p className="pl-1 sm:pl-9">
                  If you have questions regarding these Terms &amp; Conditions, please reach out to us at{" "}
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