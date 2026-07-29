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
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <NavLink to="/">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Expense Tracker
          </h2>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          Expenses
        </NavLink>
      </nav>

      {/* User Info & Logout Button */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="px-2">
          <p className="text-sm font-semibold text-white truncate">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
