"use client";

import { useEffect, useMemo, useState } from "react";
import { saleService, Sale } from "@/app/services/sale.service";
import SaleDetailsModal from "@/app/components/sales/SaleDetailsModal";
import { Search, Loader2, Receipt, Calendar, DollarSign, CheckCircle } from "lucide-react";

export default function SalesHistoryView() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSalesHistory() {
      setLoading(true);
      try {
        const timeout = new Promise<Sale[]>((resolve) =>
          setTimeout(() => resolve([]), 1500)
        );

        const fetchPromise = saleService.fetchSales();
        const data = await Promise.race([fetchPromise, timeout]);

        if (isMounted) {
          setSales(data || []);
        }
      } catch (error) {
        console.error("Failed to load sales history:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSalesHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  async function refreshSalesHistory() {
    setLoading(true);
    try {
      const timeout = new Promise<Sale[]>((resolve) =>
        setTimeout(() => resolve([]), 1500)
      );
      const data = await Promise.race([saleService.fetchSales(), timeout]);
      setSales(data || []);
    } catch (error) {
      console.error("Failed to refresh sales history:", error);
    } finally {
      setLoading(false);
    }
  }

  // Helper to extract total numeric value regardless of schema format
  const getSaleTotal = (sale: any): number => {
    return Number(
      sale?.totals?.total ??
      sale?.total_amount ??
      sale?.total ??
      sale?.amount ??
      0
    );
  };

  // Helper to extract payment method regardless of schema format
  const getPaymentMethod = (sale: any): string => {
    return (
      sale?.payment?.method ||
      sale?.payment_method ||
      sale?.payment_type ||
      sale?.paymentMethod ||
      "CASH"
    );
  };

  // Helper to extract receipt number
  const getReceiptNumber = (sale: any): string => {
    return (
      sale?.receiptNumber ||
      sale?.receipt_number ||
      sale?.id?.slice(0, 8).toUpperCase() ||
      "N/A"
    );
  };

  // Helper to extract customer name
  const getCustomerName = (sale: any): string => {
    return (
      sale?.customer?.name ||
      sale?.customer_name ||
      "Walk-in Customer"
    );
  };

  // Helper to extract cashier name
  const getCashierName = (sale: any): string => {
    return (
      sale?.cashier ||
      sale?.cashier_name ||
      "Admin"
    );
  };

  const filteredSales = useMemo(() => {
    if (!search.trim()) return sales;

    const query = search.toLowerCase();

    return sales.filter((sale) => {
      const receipt = getReceiptNumber(sale).toLowerCase();
      const customer = getCustomerName(sale).toLowerCase();
      const cashier = getCashierName(sale).toLowerCase();

      return (
        receipt.includes(query) ||
        customer.includes(query) ||
        cashier.includes(query)
      );
    });
  }, [sales, search]);

  const totalRevenue = useMemo(() => {
    return sales.reduce((sum, sale) => sum + getSaleTotal(sale), 0);
  }, [sales]);

  return (
    <div className="p-6 space-y-6 text-slate-100">
      {/* ===========================
          Page Header
      ============================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Sales History
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time transaction audit logs & receipt generation
          </p>
        </div>

        <button
          type="button"
          onClick={refreshSalesHistory}
          disabled={loading}
          className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white transition shadow-sm disabled:opacity-50"
        >
          Refresh Data
        </button>
      </div>

      {/* ===========================
          Sales Overview Cards
      ============================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Transactions
            </p>
            <h2 className="mt-2 text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              {sales.length}
            </h2>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Receipt className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Gross Revenue
            </p>
            <h2 className="mt-2 text-2xl font-extrabold font-mono text-emerald-500">
              KSh {totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completed Sales
            </p>
            <h2 className="mt-2 text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              {sales.filter((sale) => (sale.status || "completed").toLowerCase() === "completed").length}
            </h2>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filtered Results
            </p>
            <h2 className="mt-2 text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              {filteredSales.length}
            </h2>
          </div>
          <div className="p-3 bg-slate-500/10 text-slate-400 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* ===========================
          Search Input
      ============================ */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by receipt number, customer name, or cashier..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ===========================
          Sales Table
      ============================ */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr className="text-left font-semibold">
              <th className="px-6 py-4">Receipt</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Cashier</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    <span>Fetching transaction history from Supabase...</span>
                  </div>
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="space-y-1">
                    <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                      No sales found
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Completed transactions will automatically appear here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSales.map((sale: any) => {
                const total = getSaleTotal(sale);
                const paymentMethod = getPaymentMethod(sale);
                const receiptNum = getReceiptNumber(sale);
                const customer = getCustomerName(sale);
                const cashier = getCashierName(sale);
                const dateStr = sale.createdAt || sale.created_at || sale.date;

                return (
                  <tr
                    key={sale.id || receiptNum}
                    onClick={() => {
                      setSelectedSale(sale);
                      setDetailsOpen(true);
                    }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {receiptNum}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {customer}
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {cashier}
                    </td>

                    <td className="px-6 py-4 uppercase text-xs font-bold tracking-wider text-slate-500">
                      <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 border border-slate-200 dark:border-slate-700">
                        {paymentMethod}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      KSh {total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {dateStr
                        ? new Date(dateStr).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                        {sale.status || "completed"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <SaleDetailsModal
        open={detailsOpen}
        sale={selectedSale}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedSale(null);
        }}
      />
    </div>
  );
}