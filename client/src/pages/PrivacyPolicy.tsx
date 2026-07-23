import React from "react";
import LandingNavbar from "../components/LandingNavbar";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Shared Navigation Header */}
      <LandingNavbar />

      {/* Main Privacy Policy Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200/80">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Last updated: July 2026
          </p>

          <div className="space-y-8 text-slate-600 leading-relaxed text-sm md:text-base">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                1. Introduction
              </h2>
              <p>
                Welcome to <strong>Trackily</strong>. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our expense tracking services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                2. Information We Collect
              </h2>
              <p className="mb-3">
                We collect information that you provide directly to us when creating an account or logging expenses:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Account Information:</strong> Name, email address, and login credentials.
                </li>
                <li>
                  <strong>Financial Log Data:</strong> Amounts, categories, dates, and optional notes you input into Trackily.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information on how you interact with our application to help us optimize performance.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                3. How We Use Your Information
              </h2>
              <p className="mb-3">
                Your data is strictly used to provide and enhance our financial tracking services:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To create and maintain your personal Trackily account.</li>
                <li>To generate financial reports, analytics, and budgeting insights for your personal view.</li>
                <li>To maintain system security and prevent unauthorized access.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                4. Data Security & Sharing
              </h2>
              <p>
                We implement industry-standard encryption to protect your expense logs both in transit and at rest. We **never** sell, rent, or trade your personal financial data to third parties or advertising networks.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                5. Your Rights & Control
              </h2>
              <p>
                You retain full ownership of your data. You can export, edit, or permanently delete your account and all associated expense logs at any time directly through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                6. Contact Us
              </h2>
              <p>
                If you have any questions or concerns regarding this Privacy Policy, please reach out to us at{" "}
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