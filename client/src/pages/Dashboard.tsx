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
  >("this_month");

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
  const currentMonthName = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  // 1. Always compute current calendar month's total spending using `item.date` first
  const currentMonthSpent = expenses.reduce((sum, item) => {
    const rawDate = item.date || item.created_at;
    if (!rawDate) return sum;
    const itemDateStr = formatYYYYMMDD(rawDate);
    return itemDateStr.startsWith(currentMonthStr)
      ? sum + Number(item.amount)
      : sum;
  }, 0);

  // 2. Filter expenses for display widgets using `item.date` first
  const filteredExpenses = expenses.filter((item) => {
    const rawDate = item.date || item.created_at;
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

  // Colors array for category distribution visuals
  const categoryColors = [
    "#1B5E20",
    "#2E7D32",
    "#4CAF50",
    "#81C784",
    "#A5D6A7",
    "#C8E6C9",
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans text-slate-800">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {currentMonthName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Your financial summary for this month.
        </p>
      </div>

      {loading ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center text-slate-500 text-sm">
          Loading dashboard overview...
        </div>
      ) : error ? (
        <div className="p-12 bg-white rounded-2xl border border-rose-200 shadow-sm text-center text-rose-600 text-sm">
          {error}
        </div>
      ) : (
        <>
          {/* ================= 1. STAT CARDS GRID ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat Card 1: Total Spent */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
                <span>Total Spent</span>
                <span className="text-slate-400 font-mono text-sm">$</span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  ${totalSpent.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#1B5E20] mt-1">
                  <span>↗ Logged</span>
                  <span className="text-slate-400 truncate">
                    ({filterMode === "today"
                      ? "Today"
                      : filterMode === "this_month"
                      ? "This Month"
                      : "Filtered"})
                  </span>
                </div>
              </div>
            </div>

            {/* Stat Card 2: Monthly Budget (Editable) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between relative">
              <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
                <span>Monthly Budget</span>
                <button
                  onClick={() => {
                    setTempBudget(monthlyBudget.toString());
                    setIsEditingBudget(!isEditingBudget);
                  }}
                  className="text-xs text-[#1B5E20] hover:underline font-bold"
                >
                  {isEditingBudget ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className="mt-4">
                {isEditingBudget ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={tempBudget}
                      onChange={(e) => setTempBudget(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-2.5 py-1 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                    />
                    <button
                      onClick={handleSaveBudget}
                      className="rounded-lg bg-[#1B5E20] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#144718]"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      ${monthlyBudget.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] font-medium mt-1">
                      <span
                        className={
                          remainingBudget < 0
                            ? "text-rose-600 font-bold"
                            : "text-[#1B5E20] font-bold"
                        }
                      >
                        ${remainingBudget.toFixed(2)}
                      </span>
                      <span className="text-slate-400">
                        {remainingBudget < 0 ? "over budget" : "remaining"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stat Card 3: Budget Usage */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
                <span>Budget Usage</span>
                <span className="text-slate-400 text-xs">↗</span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {budgetUsedPercentage}%
                </p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      budgetUsedPercentage >= 100
                        ? "bg-rose-500"
                        : budgetUsedPercentage > 80
                        ? "bg-amber-500"
                        : "bg-[#1B5E20]"
                    }`}
                    style={{
                      width: `${Math.min(budgetUsedPercentage, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Stat Card 4: Transactions */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
                <span>Transactions</span>
                <span className="text-slate-400 text-xs">↘</span>
              </div>
              <div className="mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {transactionCount}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  Items in selected view
                </p>
              </div>
            </div>
          </div>

          {/* ================= 2. FILTER TOOLBAR ================= */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                Filter View:
              </span>
              <div className="flex flex-wrap gap-1 bg-slate-100/80 p-1 rounded-lg">
                <button
                  onClick={() => setFilterMode("today")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    filterMode === "today"
                      ? "bg-white text-[#1B5E20] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setFilterMode("this_month")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    filterMode === "this_month"
                      ? "bg-white text-[#1B5E20] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setFilterMode("all")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    filterMode === "all"
                      ? "bg-white text-[#1B5E20] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setFilterMode("custom")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    filterMode === "custom"
                      ? "bg-white text-[#1B5E20] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Specific Date
                </button>
                <button
                  onClick={() => setFilterMode("date_range")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    filterMode === "date_range"
                      ? "bg-white text-[#1B5E20] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Date Range
                </button>
              </div>
            </div>

            {/* Custom Date Controls */}
            {filterMode === "custom" && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  Select Date:
                </span>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
              </div>
            )}

            {/* Date Range Controls */}
            {filterMode === "date_range" && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-500">
                    From:
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-500">
                    To:
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ================= 3. ANALYTICS & CATEGORY SECTION ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Progress Breakdown */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Monthly Budget Progress
                  </h3>
                  <span className="text-xs font-bold text-[#1B5E20]">
                    ${currentMonthSpent.toFixed(2)} / ${monthlyBudget.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Track your monthly cap in real-time.
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden mb-6 p-0.5 border border-slate-200/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      budgetUsedPercentage >= 100
                        ? "bg-rose-600"
                        : budgetUsedPercentage > 80
                        ? "bg-amber-500"
                        : "bg-[#1B5E20]"
                    }`}
                    style={{
                      width: `${Math.min(budgetUsedPercentage, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Current Spend
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    ${currentMonthSpent.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Remaining
                  </span>
                  <span
                    className={`text-base font-bold ${
                      remainingBudget < 0 ? "text-rose-600" : "text-[#1B5E20]"
                    }`}
                  >
                    ${remainingBudget.toFixed(2)}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Status
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {budgetUsedPercentage >= 100
                      ? "Limit Reached"
                      : budgetUsedPercentage > 80
                      ? "Near Limit"
                      : "On Track"}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Breakdown (Matches Right Side Card from Screenshot) */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">By category</h3>
                <p className="text-xs text-slate-500 mt-0.5 mb-4">
                  {filterMode === "this_month" ? "This month" : "Filtered breakdown"}
                </p>

                {Object.keys(categoryTotals).length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">
                    No categories recorded.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(categoryTotals).map(
                      ([cat, amt], idx) => {
                        const percentage =
                          totalSpent > 0
                            ? Math.round((amt / totalSpent) * 100)
                            : 0;
                        const color =
                          categoryColors[idx % categoryColors.length];

                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="flex items-center gap-2 font-medium text-slate-700">
                                <span
                                  className="w-2.5 h-2.5 rounded-full inline-block"
                                  style={{ backgroundColor: color }}
                                />
                                {cat}
                              </span>
                              <span className="font-bold text-slate-900 font-mono">
                                ${amt.toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= 4. RECENT TRANSACTIONS TABLE ================= */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Recent transactions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing latest transactions
                </p>
              </div>
              <Link
                to="/expenses"
                className="text-xs font-bold text-[#1B5E20] hover:underline"
              >
                View all ↗
              </Link>
            </div>

            {recentExpenses.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No transactions found for this view.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentExpenses.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Icon Tile */}
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 font-bold text-xs">
                        $
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatYYYYMMDD(item.date || item.created_at) ||
                            "Recently"}{" "}
                          •{" "}
                          <span className="text-slate-500">
                            {item.category || "General"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-bold font-mono text-slate-900">
                      -${Number(item.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}