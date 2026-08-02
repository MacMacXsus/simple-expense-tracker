import { useState, useEffect, useRef } from "react";

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

  // Edit Expense State
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Detail Modal State
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Ref to handle clicking outside of filter menu
  const filterRef = useRef<HTMLDivElement>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Debounce Effect: Waits 300ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowForm(false);
        setEditingExpense(null);
        setSelectedExpense(null);
      }
    };
    if (showForm || selectedExpense) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showForm, selectedExpense]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch expenses for logged-in user
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

  // Format date strings to YYYY-MM-DD format
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

  // Open modal in Create mode
  const handleOpenCreate = () => {
    setEditingExpense(null);
    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate(new Date().toISOString().split("T")[0]);
    setShowForm(true);
  };

  // Open modal in Edit mode
  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setDate(formatDateDisplay(expense));
    setShowForm(true);
  };

  // Dynamic list of categories from defaults + existing expenses
  const availableCategories = Array.from(
    new Set([
      "Food",
      "Utilities",
      "Dining",
      "Shopping",
      "Transport",
      ...expenses.map((e) => e.category).filter(Boolean),
    ])
  );

  // Submit expense (Create or Update)
  const handleSubmit = async () => {
    if (!title || !amount) return;

    try {
      if (editingExpense) {
        // PUT: Update existing expense
        const res = await fetch(`${API_URL}/${editingExpense.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title,
            amount: parseFloat(amount),
            category,
            date,
          }),
        });

        if (!res.ok) throw new Error("Failed to update expense");

        const updatedExpense: Expense = await res.json();

        setExpenses(
          expenses.map((item) =>
            item.id === editingExpense.id ? updatedExpense : item
          )
        );

        // Update detail modal if open
        if (selectedExpense && selectedExpense.id === editingExpense.id) {
          setSelectedExpense(updatedExpense);
        }
      } else {
        // POST: Create new expense
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
      }

      // Reset form controls & close popup
      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate(new Date().toISOString().split("T")[0]);
      setEditingExpense(null);
      setShowForm(false);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Delete expense
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

  // Filter expenses using selected category & debounced search term
  const filteredExpenses = expenses.filter((expense) => {
    const query = debouncedSearchTerm.toLowerCase().trim();

    const matchesCategory =
      selectedCategory === "ALL" ||
      expense.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !query ||
      expense.title.toLowerCase().includes(query) ||
      expense.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Calculate total amount for summary row
  const totalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  // Category Color mapping
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
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-lg bg-[#1B5E20] hover:bg-[#144718] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
        >
          + Add expense
        </button>
      </div>

      {/* Add / Edit Expense Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          onClick={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200/80 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingExpense ? "Edit Expense" : "Add New Expense"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingExpense
                    ? "Modify transaction details."
                    : "Fill in the details to record a new transaction."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingExpense(null);
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
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

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingExpense(null);
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1B5E20] hover:bg-[#144718] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
                >
                  {editingExpense ? "Save Changes" : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Detail View Modal */}
      {selectedExpense && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          onClick={() => setSelectedExpense(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200/80 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Transaction Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Expense ID: #{selectedExpense.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExpense(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Amount Spent
                </span>
                <p className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
                  ${Number(selectedExpense.amount).toFixed(2)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Description
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {selectedExpense.title}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </span>
                  <p
                    className={`font-semibold mt-0.5 ${getCategoryColor(
                      selectedExpense.category
                    )}`}
                  >
                    {selectedExpense.category}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Date
                  </span>
                  <p className="font-mono text-slate-600 mt-0.5">
                    {formatDateDisplay(selectedExpense)}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </span>
                  <div className="mt-0.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      cleared
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedExpense;
                    setSelectedExpense(null);
                    handleOpenEdit(target);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Edit expense"
                >
                  <svg
                    className="w-3.5 h-3.5 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(selectedExpense.id);
                    setSelectedExpense(null);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete expense"
                >
                  <svg
                    className="w-3.5 h-3.5 text-rose-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExpense(null)}
                className="rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
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

        {/* Category Filter Popover Menu */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium shadow-sm transition-colors cursor-pointer ${
              selectedCategory !== "ALL"
                ? "border-[#1B5E20] bg-emerald-50 text-[#1B5E20]"
                : "border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <svg
              className={`w-3.5 h-3.5 ${
                selectedCategory !== "ALL"
                  ? "text-[#1B5E20]"
                  : "text-slate-400"
              }`}
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
            <span>
              {selectedCategory === "ALL"
                ? "Filter"
                : `Category: ${selectedCategory}`}
            </span>
            <span className="text-[10px]">▼</span>
          </button>

          {/* Dropdown Options */}
          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-2 shadow-xl border border-slate-200/80 z-30 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Category Filter
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("ALL");
                  setShowFilterMenu(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategory === "ALL"
                    ? "bg-slate-100 font-bold text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === "ALL" && <span>✓</span>}
              </button>

              <hr className="border-slate-100 my-1" />

              {availableCategories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-emerald-50 font-bold text-[#1B5E20]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                    <span>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
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
              : `No expenses found matching your filters.`}
          </div>
        ) : (
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200/80 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 font-medium bg-slate-50">Date</th>
                  <th className="px-6 py-3 font-medium bg-slate-50">Description</th>
                  <th className="px-6 py-3 font-medium bg-slate-50">Category</th>
                  <th className="px-6 py-3 font-medium bg-slate-50">Status</th>
                  <th className="px-6 py-3 font-medium text-right bg-slate-50">Amount</th>
                  <th className="px-6 py-3 font-medium text-right bg-slate-50">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    onClick={() => setSelectedExpense(expense)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
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
                      <div className="inline-flex items-center justify-end gap-1">
                        {/* Edit Icon Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(expense);
                          }}
                          className="p-1.5 rounded-md text-slate-400 hover:text-[#1B5E20] hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Edit expense"
                          aria-label="Edit expense"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>

                        {/* Delete Icon Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents opening detail modal
                            handleDelete(expense.id);
                          }}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete expense"
                          aria-label="Delete expense"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200/80 text-xs font-semibold text-slate-500 sticky bottom-0 z-10 shadow-sm">
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-slate-400 bg-slate-50">
                    {filteredExpenses.length} rows
                  </td>
                  <td colSpan={3} className="px-6 py-3 text-right bg-slate-50">
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