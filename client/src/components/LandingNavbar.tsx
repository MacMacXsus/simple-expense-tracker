import React from "react";
import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-xl text-white tracking-tight"
        >
          <div className="bg-[#1B5E20] text-[#A5D6A7] px-2 py-0.5 rounded-md flex items-center justify-center border border-[#66BB6A]/40 text-sm font-mono font-bold">
            $
          </div>
          <span>Trackily</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            About Us
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-200 hover:text-white transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-all shadow-sm"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}