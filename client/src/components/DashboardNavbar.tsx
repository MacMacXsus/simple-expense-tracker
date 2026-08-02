import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <aside className="w-64 bg-white text-slate-800 flex flex-col h-screen border-r border-slate-200/80 sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="bg-[#1B5E20] text-white w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-sm shadow-sm">
            $
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Trackily
          </span>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-[#E8F5E9] text-[#1B5E20] font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-[#E8F5E9] text-[#1B5E20] font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          Expenses
        </NavLink>
      </nav>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="px-2">
          <p className="text-xs font-bold text-slate-900 truncate">
            {user?.name || "User"}
          </p>
          <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 rounded-lg transition-all cursor-pointer"
        >
          <span>[→</span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}