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

  // Debounce Effect: Waits 300ms after the user stops typing to update filter
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
        credentials: "include", // Pass authentication cookie
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

  // Helper function to format date strings cleanly
  const formatDateDisplay = (expense: Expense) => {
    if (expense.date) {
      // Append time portion to force local midnight parsing
      const d = new Date(expense.date.includes("T") ? expense.date : `${expense.date}T00:00:00`);
      return isNaN(d.getTime()) ? expense.date : d.toLocaleDateString();
    }
    if (expense.created_at) {
      const d = new Date(expense.created_at);
      return isNaN(d.getTime()) ? expense.created_at : d.toLocaleDateString();
    }
    return "N/A";
  };

  // 2. Submit new expense for logged-in user
  const handleSubmit = async () => {
    if (!title || !amount) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Pass authentication cookie
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          category,
          date, // <-- Included selected date in payload
        }),
      });

      if (!res.ok) throw new Error("Failed to save expense");

      const newExpense: Expense = await res.json();

      // Prepend newly created item to state
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
        credentials: "include", // Pass authentication cookie
      });

      if (!res.ok) throw new Error("Failed to delete expense");

      // Update state after deletion
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

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-sm text-slate-500">
            Manage, filter, and track all your logged expenses.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Expense"}
        </button>
      </div>

      {/* Add Expense Form Card */}
      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4"
        >
          <h2 className="text-lg font-bold text-slate-800">Add New Expense</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. Weekly Groceries"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Save Expense
            </button>
          </div>
        </form>
      )}

      {/* Search Input Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search expenses by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-3"
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
      </div>

      {/* Expense List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading expenses...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            {expenses.length === 0
              ? 'No expenses recorded yet. Click "+ Add Expense" above to add one!'
              : `No expenses matching "${debouncedSearchTerm}".`}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Expense</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {expense.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDateDisplay(expense)}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      -${Number(expense.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}