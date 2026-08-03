import React from "react";
import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200/80 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Trackily. All rights reserved.</p>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 font-medium">
          <Link
            to="/privacy-policy"
            className="hover:text-slate-900 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="hover:text-slate-900 transition-colors"
          >
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}