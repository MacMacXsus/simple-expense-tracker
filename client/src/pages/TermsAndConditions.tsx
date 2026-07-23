import React from "react";
import LandingNavbar from "../components/LandingNavbar";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Shared Navigation Header */}
      <LandingNavbar />

      {/* Main Terms & Conditions Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200/80">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Last updated: July 2026
          </p>

          <div className="space-y-8 text-slate-600 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using <strong>Trackily</strong>, you agree to be bound by these Terms &amp; Conditions. If you do not agree to all of these terms, please do not access or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                2. Description of Service
              </h2>
              <p>
                Trackily provides personal finance and expense tracking management tools. We reserve the right to update, modify, or discontinue any feature of the service at any time to improve system stability or user experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                3. User Accounts &amp; Security
              </h2>
              <p className="mb-3">
                When you create an account with us, you must provide accurate and complete information:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account password.</li>
                <li>You are responsible for all activities that occur under your account.</li>
                <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                4. Acceptable Use
              </h2>
              <p>
                You agree not to use Trackily for any unlawful purpose or to attempt to breach, disrupt, or interfere with our servers, network security, or user data interfaces.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                5. Intellectual Property
              </h2>
              <p>
                All original content, features, logos, and functionality within Trackily remain the exclusive property of Trackily and its licensors. You may not reproduce or distribute any part of the software without explicit written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                6. Limitation of Liability
              </h2>
              <p>
                Trackily is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for accuracy and reliability, Trackily is an informational expense tracking tool and does not constitute formal financial, accounting, or tax advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                7. Contact Us
              </h2>
              <p>
                If you have questions regarding these Terms &amp; Conditions, please reach out to us at{" "}
                <a
                  href="mailto:support@trackily.com"
                  className="text-blue-600 hover:underline font-medium"
                >
                  support@trackily.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}