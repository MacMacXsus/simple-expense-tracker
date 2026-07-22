import { Link } from "react-router-dom";

export default function DashboardNavbar() {
  return (
    <>
      <nav className="bg-white shadow-sm mb-6">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">
            Simple Expense Tracker (Dashboard Navbar)
          </h1>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Landing
            </Link>
            <Link
              to="/dashboard"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/expenses"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Expenses
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
