import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function LandingNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (id: string) => {
    if (location.pathname === "/") {
      // Already on the home/landing page -> smooth scroll directly
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // On another page (e.g. /privacy-policy) -> redirect home & pass section ID
      navigate("/", { state: { scrollTo: id } });
    }
  };

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
          <button
            onClick={() => handleNavClick("features")}
            className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick("pricing")}
            className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavClick("about")}
            className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
          >
            About Us
          </button>
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