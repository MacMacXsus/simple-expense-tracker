import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500">
            Here is a summary of your financial activity this month.
          </p>
        </div>
        <Link
          to="/expenses"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          View All Expenses
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Spent
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">$1,245.00</p>
          <span className="text-xs text-emerald-600 font-medium">↓ 12% from last month</span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Monthly Budget
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">$2,000.00</p>
          <span className="text-xs text-slate-500">$755.00 remaining</span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Transactions
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">18</p>
          <span className="text-xs text-slate-500">Logged this month</span>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
          <Link to="/expenses" className="text-sm font-semibold text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        <ul className="divide-y divide-slate-100">
          <li className="py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Grocery Shopping</p>
              <p className="text-xs text-slate-400">Food • Yesterday</p>
            </div>
            <span className="font-bold text-slate-800 text-sm">-$84.20</span>
          </li>
          <li className="py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Internet Bill</p>
              <p className="text-xs text-slate-400">Utilities • 3 days ago</p>
            </div>
            <span className="font-bold text-slate-800 text-sm">-$60.00</span>
          </li>
          <li className="py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Coffee Shop</p>
              <p className="text-xs text-slate-400">Dining • 5 days ago</p>
            </div>
            <span className="font-bold text-slate-800 text-sm">-$12.50</span>
          </li>
        </ul>
      </div>
    </main>
  );
}