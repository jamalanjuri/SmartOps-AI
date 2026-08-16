"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Receipt,
  Plus,
  Search,
  RefreshCw,
  X,
  Loader2,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  expenseService,
  type Expense,
} from "@/app/services/expense.service";
import RoleGuard from "@/app/components/auth/RoleGuard";

const EXPENSE_CATEGORIES = [
  "Rent & Lease",
  "Utilities (Electricity, Water)",
  "Salaries & Wages",
  "Transport & Logistics",
  "Marketing & Ads",
  "Equipment & Maintenance",
  "Licenses & Permits",
  "Miscellaneous",
];

export default function ExpensesView() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (err: any) {
      console.error("Failed to load expenses:", err);
      setError(err?.message || "Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0 || isSaving) return;

    setIsSaving(true);
    try {
      await expenseService.createExpense({
        category,
        description: description.trim(),
        amount,
        paymentMethod,
        expenseDate,
      });

      setShowAddModal(false);
      setDescription("");
      setAmount(0);
      setCategory(EXPENSE_CATEGORIES[0]);
      setPaymentMethod("Cash");
      await loadExpenses();
    } catch (err: any) {
      console.error("Failed to record expense:", err);
      alert(err?.message || "Failed to record expense.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const confirmed = window.confirm("Delete this expense record permanently?");
    if (!confirmed) return;

    try {
      await expenseService.deleteExpense(id);
      await loadExpenses();
    } catch (err: any) {
      console.error("Failed to delete expense:", err);
      alert(err?.message || "Failed to delete expense.");
    }
  };

  const filteredExpenses = useMemo(() => {
    const keyword = searchQuery.toLowerCase().trim();
    if (!keyword) return expenses;

    return expenses.filter(
      (e) =>
        e.category.toLowerCase().includes(keyword) ||
        e.description.toLowerCase().includes(keyword) ||
        e.paymentMethod.toLowerCase().includes(keyword)
    );
  }, [expenses, searchQuery]);

  const totalExpenseValue = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  return (
    <RoleGuard allowedRoles={["admin", "manager"]}>
      <div className="space-y-8 p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Expense Tracking
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Log operational overhead, wages, utilities, and store expenditures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadExpenses}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Log Expense
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Expenditure
              </p>
              <span className="rounded-xl bg-rose-500/10 p-2.5 text-rose-600 dark:text-rose-400">
                <DollarSign className="h-5 w-5" />
              </span>
            </div>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-slate-100">
              KES {totalExpenseValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h3>
            <p className="mt-1 text-xs text-slate-400">Recorded operational costs</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Recorded Vouchers
              </p>
              <span className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-600 dark:text-indigo-400">
                <Receipt className="h-5 w-5" />
              </span>
            </div>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono">
              {filteredExpenses.length}
            </h3>
            <p className="mt-1 text-xs text-slate-400">Vouchers in current view</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Top Expense Category
              </p>
              <span className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
                <TrendingUp className="h-5 w-5" />
              </span>
            </div>
            <h3 className="mt-3 text-xl font-bold tracking-tight truncate">
              {filteredExpenses.length > 0 ? filteredExpenses[0].category : "N/A"}
            </h3>
            <p className="mt-1 text-xs text-slate-400">Most recent classification</p>
          </div>
        </div>

        {/* Main Expense Table */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Expense Ledger</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live overhead logs persisted in Supabase.
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search category, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Description</th>
                  <th className="py-3.5 px-4 font-semibold">Payment Method</th>
                  <th className="py-3.5 px-4 text-right font-semibold">Amount</th>
                  <th className="py-3.5 px-6 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                        <span>Loading expense ledger...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No expenses logged yet.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">
                        {expense.expenseDate}
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {expense.category}
                      </td>

                      <td className="py-4 px-4 text-xs max-w-xs truncate text-slate-600 dark:text-slate-300">
                        {expense.description}
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                          {expense.paymentMethod}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                        KES {expense.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 transition"
                          title="Delete Expense"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold">Log Operational Expense</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateExpense} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Description / Note <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monthly electricity bill for August"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Amount (KES) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      required
                      value={amount || ""}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Cash">Cash</option>
                      <option value="M-Pesa">M-Pesa</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !description.trim() || amount <= 0}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Expense Record</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}