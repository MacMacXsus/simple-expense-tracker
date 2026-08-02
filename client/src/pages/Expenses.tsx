import { useState, useEffect } from "react";

interface Expense {
  id: number | string;
  user_id?: number;
  title: string;
  amount: number;
  category: string;
  created_at?: string;
  date?: string;
}

const API_URL = "http://localhost:5000/api/expenses";

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Search & Debounce State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Debounce Effect: Waits 300ms after the user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 1. Fetch expenses for logged-in user
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL, {
        credentials: "include",
      });

      if (res.status === 401) {
        throw new Error("Please log in to view your expenses.");
      }

      if (!res.ok) throw new Error("Failed to load expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Format date strings to YYYY-MM-DD format as seen in screenshot
  const formatDateDisplay = (expense: Expense) => {
    const raw = expense.date || expense.created_at;
    if (!raw) return "N/A";
    const d = new Date(raw.includes("T") ? raw : `${raw}T00:00:00`);
    if (isNaN(d.getTime())) return raw.substring(0, 10);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 2. Submit new expense for logged-in user
  const handleSubmit = async () => {
    if (!title || !amount) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          category,
          date,
        }),
      });

      if (!res.ok) throw new Error("Failed to save expense");

      const newExpense: Expense = await res.json();

      setExpenses([newExpense, ...expenses]);

      // Reset form controls
      setTitle("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setShowForm(false);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // 3. Delete expense
  const handleDelete = async (id: number | string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete expense");

      setExpenses(expenses.filter((item) => item.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Filter expenses using the debounced search term
  const filteredExpenses = expenses.filter((expense) => {
    const query = debouncedSearchTerm.toLowerCase().trim();
    if (!query) return true;

    const titleMatch = expense.title.toLowerCase().includes(query);
    const categoryMatch = expense.category.toLowerCase().includes(query);

    return titleMatch || categoryMatch;
  });

  // Calculate total amount for the summary row
  const totalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  // Category Color mapping based on design screenshot
  const getCategoryColor = (catName: string) => {
    switch (catName.toLowerCase()) {
      case "food":
        return "text-blue-600";
      case "income":
        return "text-[#16A34A]";
      case "utilities":
        return "text-purple-600";
      case "transport":
        return "text-amber-600";
      case "housing":
        return "text-emerald-700";
      case "subscriptions":
      case "dining":
        return "text-pink-600";
      case "health":
      case "shopping":
        return "text-rose-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Expenses
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {expenses.length} transactions
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center rounded-lg bg-[#1B5E20] hover:bg-[#144718] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
        >
          {showForm ? "Cancel" : "+ Add expense"}
        </button>
      </div>

      {/* Add Expense Form Card */}
      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4"
        >
          <h2 className="text-sm font-bold text-slate-900">Add New Expense</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. Whole Foods Market"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B5E20] bg-white"
              >
                <option value="Food">Food</option>
                <option value="Utilities">Utilities</option>
                <option value="Dining">Dining</option>
                <option value="Shopping">Shopping</option>
                <option value="Transport">Transport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-lg bg-[#1B5E20] hover:bg-[#144718] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
            >
              Save Expense
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200/80 bg-white pl-9 pr-4 py-2 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] shadow-sm"
          />
          <svg
            className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200/80 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm cursor-pointer">
          <svg
            className="w-3.5 h-3.5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>Filter</span>
          <span className="text-[10px]">▼</span>
        </button>
      </div>

      {/* Expense List Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Loading expenses...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-xs text-rose-500">{error}</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {expenses.length === 0
              ? 'No expenses recorded yet. Click "+ Add expense" above to add one!'
              : `No expenses matching "${debouncedSearchTerm}".`}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/50 text-[11px] font-semibold text-slate-500 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    <td className="px-6 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                      {formatDateDisplay(expense)}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-slate-900">
                      {expense.title}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`font-semibold ${getCategoryColor(
                          expense.category
                        )}`}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        cleared
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold font-mono text-slate-900 whitespace-nowrap">
                      ${Number(expense.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-[11px] font-medium text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/50 border-t border-slate-200/80 text-xs font-semibold text-slate-500">
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-slate-400">
                    {filteredExpenses.length} rows
                  </td>
                  <td colSpan={3} className="px-6 py-3 text-right">
                    <span>Total: </span>
                    <span className="font-bold font-mono text-slate-900 ml-1">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}