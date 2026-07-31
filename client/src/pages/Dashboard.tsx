import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Expense {
  id: number | string;
  title: string;
  amount: number;
  category: string;
  created_at?: string;
  date?: string;
}

// Helper function to format Date objects/strings to YYYY-MM-DD in local time
const formatYYYYMMDD = (dateInput?: Date | string) => {
  if (!dateInput) return "";
  const d =
    typeof dateInput === "string" && !dateInput.includes("T")
      ? new Date(`${dateInput}T00:00:00`)
      : new Date(dateInput);

  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(2000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState("2000");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter Mode State
  const [filterMode, setFilterMode] = useState<
    "today" | "this_month" | "all" | "custom" | "date_range"
  >("today");

  // Single Date Filter
  const [customDate, setCustomDate] = useState<string>(
    formatYYYYMMDD(new Date())
  );

  // Date Range Filter (Default: 1st of current month to today)
  const now = new Date();
  const [startDate, setStartDate] = useState<string>(
    formatYYYYMMDD(new Date(now.getFullYear(), now.getMonth(), 1))
  );
  const [endDate, setEndDate] = useState<string>(formatYYYYMMDD(now));

  // Fetch expenses and budget from MySQL backend in parallel
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [expensesRes, budgetRes] = await Promise.all([
          fetch("http://localhost:5000/api/expenses", {
            credentials: "include",
          }),
          fetch("http://localhost:5000/api/budget", {
            credentials: "include",
          }),
        ]);

        if (!expensesRes.ok || !budgetRes.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const expensesData = await expensesRes.json();
        const budgetData = await budgetRes.json();

        setExpenses(expensesData);
        setMonthlyBudget(budgetData.amount);
        setTempBudget(budgetData.amount.toString());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Save updated budget to MySQL backend
  const handleSaveBudget = async () => {
    const val = parseFloat(tempBudget);
    if (isNaN(val) || val < 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/budget", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: val }),
      });

      if (!res.ok) throw new Error("Failed to save budget");

      const data = await res.json();
      setMonthlyBudget(data.amount);
      setIsEditingBudget(false);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Dates reference for current month logic
  const todayStr = formatYYYYMMDD(new Date());
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  // 1. Always compute current calendar month's total spending using `item.date` first
  const currentMonthSpent = expenses.reduce((sum, item) => {
    const rawDate = item.date || item.created_at; // Prioritize `date`
    if (!rawDate) return sum;
    const itemDateStr = formatYYYYMMDD(rawDate);
    return itemDateStr.startsWith(currentMonthStr)
      ? sum + Number(item.amount)
      : sum;
  }, 0);

  // 2. Filter expenses for display widgets using `item.date` first
  const filteredExpenses = expenses.filter((item) => {
    const rawDate = item.date || item.created_at; // Prioritize `date`
    if (!rawDate) return filterMode === "all";

    const itemDateStr = formatYYYYMMDD(rawDate);

    if (filterMode === "today") {
      return itemDateStr === todayStr;
    } else if (filterMode === "this_month") {
      return itemDateStr.startsWith(currentMonthStr);
    } else if (filterMode === "custom") {
      return itemDateStr === customDate;
    } else if (filterMode === "date_range") {
      if (!startDate && !endDate) return true;
      if (startDate && !endDate) return itemDateStr >= startDate;
      if (!startDate && endDate) return itemDateStr <= endDate;
      return itemDateStr >= startDate && itemDateStr <= endDate;
    }
    return true; // 'all'
  });

  // Filtered Metric Calculations
  const totalSpent = filteredExpenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );
  const transactionCount = filteredExpenses.length;
  const recentExpenses = filteredExpenses.slice(0, 5);

  // Strictly Current-Month Budget Calculations
  const remainingBudget = monthlyBudget - currentMonthSpent;
  const budgetUsedPercentage =
    monthlyBudget > 0
      ? Math.min(
          Math.round((currentMonthSpent / monthlyBudget) * 100),
          100
        )
      : 0;

  // Category Breakdown Calculations derived from filteredExpenses
  const categoryTotals = filteredExpenses.reduce(
    (acc, item) => {
      const cat = item.category || "Other";
      acc[cat] = (acc[cat] || 0) + Number(item.amount);
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome Back, {user?.name || "User"}
          </h1>
          <p className="text-sm text-slate-500">
            Here is a summary of your financial activity.
          </p>
        </div>
        <Link
          to="/expenses"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          View All Expenses
        </Link>
      </div>

      {loading ? (
        <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
          Loading dashboard overview...
        </div>
      ) : error ? (
        <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-red-500">
          {error}
        </div>
      ) : (
        <>
          {/* Date Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Filter:
              </span>
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setFilterMode("today")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    filterMode === "today"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setFilterMode("this_month")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    filterMode === "this_month"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setFilterMode("all")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    filterMode === "all"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setFilterMode("custom")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    filterMode === "custom"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Specific Date
                </button>
                <button
                  onClick={() => setFilterMode("date_range")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    filterMode === "date_range"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Date Range
                </button>
              </div>
            </div>

            {/* Controls for Specific Date */}
            {filterMode === "custom" && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600">
                  Select Date:
                </label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Controls for Date Range */}
            {filterMode === "date_range" && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    From:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-xs font-medium text-slate-600">
                    To:
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Spent
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                ${totalSpent.toFixed(2)}
              </p>
              <span className="text-xs text-slate-500 truncate block">
                {filterMode === "today"
                  ? "Logged today"
                  : filterMode === "this_month"
                  ? "Logged this month"
                  : filterMode === "custom"
                  ? `Logged on ${customDate}`
                  : filterMode === "date_range"
                  ? `${startDate || "Start"} to ${endDate || "End"}`
                  : "All-time total"}
              </span>
            </div>

            {/* Monthly Budget (Stays Current Month) */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm relative">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Monthly Budget
                </p>
                <button
                  onClick={() => {
                    setTempBudget(monthlyBudget.toString());
                    setIsEditingBudget(!isEditingBudget);
                  }}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  {isEditingBudget ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditingBudget ? (
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSaveBudget}
                    className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    ${monthlyBudget.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs font-medium ${
                      remainingBudget < 0 ? "text-red-500" : "text-emerald-600"
                    }`}
                  >
                    ${remainingBudget.toFixed(2)}{" "}
                    {remainingBudget < 0 ? "over budget" : "remaining"} (this
                    month)
                  </span>
                </>
              )}
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Transactions
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {transactionCount}
              </p>
              <span className="text-xs text-slate-500">Filtered items</span>
            </div>
          </div>

          {/* Budget Usage Bar (Strictly Current Month) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
              <span>Current Month Budget Usage</span>
              <span>{budgetUsedPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  budgetUsedPercentage >= 100
                    ? "bg-red-500"
                    : budgetUsedPercentage > 80
                    ? "bg-amber-500"
                    : "bg-blue-600"
                }`}
                style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-800">
                Spending by Category
              </h2>

              {Object.keys(categoryTotals).length === 0 ? (
                <p className="text-sm text-slate-500">
                  No categories recorded for this time range.
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(categoryTotals).map(([cat, amt]) => {
                    const percentage =
                      totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-600">
                          <span>{cat}</span>
                          <span>
                            ${amt.toFixed(2)} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Activity List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  Recent Transactions
                </h2>
                <Link
                  to="/expenses"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  View all
                </Link>
              </div>

              {recentExpenses.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">
                  No transactions found for this time range.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {recentExpenses.map((item) => (
                    <li
                      key={item.id}
                      className="py-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.category} •{" "}
                          {formatYYYYMMDD(item.date || item.created_at) || "Recently"}
                        </p>
                      </div>
                      <span className="font-bold text-slate-800 text-sm">
                        -${Number(item.amount).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}