"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Receipt,
  PieChart,
  RefreshCw,
  Loader2,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  reportService,
  type FinancialMetrics,
} from "@/app/services/report.service";
import RoleGuard from "@/app/components/auth/RoleGuard";

export default function ReportsView() {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getFinancialSummary();
      setMetrics(data);
    } catch (err: any) {
      console.error("Failed to load financial reports:", err);
      setError(err?.message || "Failed to load financial metrics.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RoleGuard allowedRoles={["admin", "manager"]}>
      <div className="space-y-8 p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Financial Analytics & Reports
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Real-time calculations from live Supabase transactions and expenses.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSummary}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Financials
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm font-semibold">Calculating live totals from database...</p>
          </div>
        ) : metrics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Total Gross Revenue
                  </p>
                  <span className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono">
                  KES {metrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{metrics.salesCount} sales recorded</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Total Expenses
                  </p>
                  <span className="rounded-xl bg-rose-500/10 p-2.5 text-rose-600 dark:text-rose-400">
                    <Receipt className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono text-rose-600 dark:text-rose-400">
                  KES {metrics.totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
                <p className="mt-1 text-xs text-slate-400">Operational overhead</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Gross Profit
                  </p>
                  <span className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-600 dark:text-indigo-400">
                    <TrendingUp className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono text-indigo-600 dark:text-indigo-400">
                  KES {metrics.grossProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
                <p className="mt-1 text-xs text-slate-400">Margin: {metrics.grossMarginPercentage.toFixed(1)}%</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Net Bottom-Line
                  </p>
                  <span
                    className={`rounded-xl p-2.5 ${
                      metrics.netProfit >= 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    <Wallet className="h-5 w-5" />
                  </span>
                </div>
                <h3
                  className={`mt-3 text-3xl font-extrabold tracking-tight font-mono ${
                    metrics.netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  KES {metrics.netProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
                <p className="mt-1 text-xs text-slate-400">Net Margin: {metrics.netMarginPercentage.toFixed(1)}%</p>
              </div>
            </div>

            {/* Income Statement Breakdown */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold">Executive Income Statement</h2>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                <div className="py-3 flex justify-between items-center font-semibold">
                  <span className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    Gross Sales Revenue
                  </span>
                  <span className="font-mono">
                    KES {metrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="py-3 flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span className="pl-6 flex items-center gap-2">
                    <ArrowDownRight className="h-4 w-4 text-amber-500" />
                    Less: Cost of Goods Sold (COGS)
                  </span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    - KES {metrics.totalCOGS.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="py-3 flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span className="pl-6 flex items-center gap-2">
                    <ArrowDownRight className="h-4 w-4 text-rose-500" />
                    Less: Operating Overhead Expenses
                  </span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    - KES {metrics.totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="py-4 flex justify-between items-center font-extrabold text-base bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-4 rounded-xl border border-emerald-500/20">
                  <span>Net Bottom-Line Profit</span>
                  <span className="font-mono">
                    KES {metrics.netProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </RoleGuard>
  );
}