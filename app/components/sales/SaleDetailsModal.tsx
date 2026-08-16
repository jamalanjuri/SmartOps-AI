"use client";

import { X, Receipt, User, CreditCard, Printer, Mail, RotateCcw } from "lucide-react";
import { Sale } from "@/app/services/sale.service";
import ReceiptView from "./ReceiptView";

interface SaleDetailsModalProps {
  open: boolean;
  sale: Sale | null;
  onClose: () => void;
}

export default function SaleDetailsModal({
  open,
  sale,
  onClose,
}: SaleDetailsModalProps) {

  const handlePrintReceipt = () => {
    if (!sale) return;

    const receipt = document.querySelector(
      ".receipt-print"
    ) as HTMLElement | null;

    if (!receipt) return;

    const printWindow = window.open(
      "",
      "_blank",
      "width=420,height=800"
    );

    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt ${sale.receiptNumber || "Receipt"}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              padding: 8px;
              background: #fff;
              font-family: 'Courier New', Courier, monospace;
              font-size: 11px;
              line-height: 1.25;
              color: #000;
            }
            .receipt-print {
              width: 100%;
              max-width: 80mm;
              margin: 0 auto;
            }
            .flex {
              display: flex !important;
            }
            .justify-between {
              justify-content: space-between !important;
            }
            .justify-center {
              justify-content: center !important;
            }
            .items-center {
              align-items: center !important;
            }
            .text-center {
              text-align: center !important;
            }
            .text-right {
              text-align: right !important;
            }
            .text-left {
              text-align: left !important;
            }
            .font-bold {
              font-weight: 700 !important;
            }
            .font-extrabold {
              font-weight: 800 !important;
            }
            .font-semibold {
              font-weight: 600 !important;
            }
            .font-medium {
              font-weight: 500 !important;
            }
            .border-y {
              border-top: 1px dashed #000 !important;
              border-bottom: 1px dashed #000 !important;
            }
            .border-b {
              border-bottom: 1px solid #000 !important;
            }
            .border-dashed {
              border-style: dashed !important;
            }
            hr {
              border: none;
              border-top: 1px dashed #000;
              margin: 6px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 6px;
            }
            th, td {
              padding: 3px 0;
            }
            .space-y-1 > * + * { margin-top: 3px; }
            .space-y-2 > * + * { margin-top: 6px; }
            .my-1 { margin-top: 4px; margin-bottom: 4px; }
            .my-2 { margin-top: 8px; margin-bottom: 8px; }
            .my-3 { margin-top: 12px; margin-bottom: 12px; }
            .py-1 { padding-top: 4px; padding-bottom: 4px; }
            .py-2 { padding-top: 8px; padding-bottom: 8px; }
            .py-3 { padding-top: 12px; padding-bottom: 12px; }
            .mt-1 { margin-top: 4px; }
            .mt-2 { margin-top: 8px; }
            .mt-3 { margin-top: 12px; }
            .mt-4 { margin-top: 16px; }
            .mb-1 { margin-bottom: 4px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-3 { margin-bottom: 12px; }
            .mb-4 { margin-bottom: 16px; }
            .text-xl { font-size: 16px; font-weight: bold; }
            .text-2xl { font-size: 18px; font-weight: bold; }
            .text-\\[10px\\] { font-size: 10px; }
            .text-\\[9px\\] { font-size: 9px; }
            .truncate {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .break-all {
              word-break: break-all;
            }
            .break-words {
              word-break: break-word;
            }
            @media print {
              body { padding: 0; }
              @page { margin: 0; size: auto; }
            }
          </style>
        </head>
        <body>
          ${receipt.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 300);
  };

  if (!open || !sale) return null;

  const items = sale.items || [];
  const payment = sale.payment || (sale as any).payment_details || {};
  const totals = sale.totals || {
    subtotal: (sale as any).subtotal || (sale as any).total_amount || 0,
    vat: (sale as any).vat || 0,
    discount: (sale as any).discount || 0,
    total: (sale as any).total || (sale as any).total_amount || 0,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900 text-slate-900 dark:text-slate-100">

        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <Receipt size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Transaction Details
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Receipt #{sale.receiptNumber || (sale as any).receipt_number || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                sale.status === "completed"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              }`}
            >
              {sale.status || "Completed"}
            </span>

            <button
              onClick={onClose}
              className="rounded-xl p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
          {/* Customer & Staff */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                <User size={22} />
              </div>
              <h3 className="text-lg font-bold">Customer & Staff</h3>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Customer Account</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {sale.customer?.name || (sale as any).customer_name || "Walk-in Customer"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Cashier</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {sale.cashier || (sale as any).cashier_name || "Admin"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                <CreditCard size={22} />
              </div>
              <h3 className="text-lg font-bold">Payment Method</h3>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Method</p>
                <p className="font-semibold capitalize text-slate-900 dark:text-slate-100 mt-0.5">
                  {payment?.method || (sale as any).payment_method || "Cash"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Status</p>
                <p className="font-semibold capitalize text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {sale.status || "Completed"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Items Table */}
        <div className="px-8 pb-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="border-b border-slate-200 bg-slate-100 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
              <h3 className="text-base font-bold">Purchased Items</h3>
            </div>

            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Product</th>
                  <th className="px-6 py-3 text-center font-semibold">Qty</th>
                  <th className="px-6 py-3 text-right font-semibold">Unit Price</th>
                  <th className="px-6 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {items.length > 0 ? (
                  items.map((item: any) => (
                    <tr key={item.id || item.product_id || Math.random()}>
                      <td className="px-6 py-4 font-medium">{item.name || item.product_name}</td>
                      <td className="px-6 py-4 text-center font-mono">{item.quantity}</td>
                      <td className="px-6 py-4 text-right font-mono">
                        KSh {Number(item.unitPrice || item.unit_price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold font-mono">
                        KSh {Number(item.total || item.total_price || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-slate-400">
                      No items recorded for this transaction.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="px-8 pb-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
            <h3 className="mb-4 text-base font-bold">Payment Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-mono font-medium">
                  KSh {Number(totals.subtotal || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">VAT (16%)</span>
                <span className="font-mono font-medium">
                  KSh {Number(totals.vat || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Discount</span>
                <span className="font-mono font-medium text-emerald-500">
                  -KSh {Number(totals.discount || 0).toFixed(2)}
                </span>
              </div>

              <hr className="border-slate-200 dark:border-slate-700" />

              <div className="flex justify-between text-base font-bold">
                <span>Grand Total</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  KSh {Number(totals.total || 0).toFixed(2)}
                </span>
              </div>

              <hr className="border-slate-200 dark:border-slate-700" />

              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Amount Received</span>
                <span className="font-mono font-medium">
                  KSh {Number(payment?.amountReceived || (sale as any).amount_received || totals.total || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Change Due</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                  KSh {Number(payment?.change || (sale as any).change_due || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Actions Footer */}
        <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white px-8 py-4 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={handlePrintReceipt}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-5 py-2.5 text-xs font-bold transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-5 py-2.5 text-xs font-bold opacity-60 cursor-not-allowed select-none"
          >
            <Mail size={16} />
            <span>Email Receipt</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-5 py-2.5 text-xs font-bold opacity-60 cursor-not-allowed select-none"
          >
            <RotateCcw size={16} />
            <span>Refund</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs font-bold text-white transition shadow-sm"
          >
            Close
          </button>
        </div>

        {/* Off-Screen Thermal Receipt Rendering Engine */}
        <div className="hidden">
          <div className="receipt-print">
            <ReceiptView sale={sale} />
          </div>
        </div>

      </div>
    </div>
  );
}