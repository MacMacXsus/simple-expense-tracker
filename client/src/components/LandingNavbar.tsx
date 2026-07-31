import React from "react";
import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <header className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold text-2xl text-slate-900"
        >
          <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
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
          <span>Trackily</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">
            Pricing
          </a>
          <a href="#about" className="hover:text-slate-900 transition-colors">
            About Us
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    </header>
  );
}