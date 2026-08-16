"use client";

import { useEffect, useState } from "react";
import { Store } from "lucide-react";
import { Sale } from "@/app/services/sale.service";

interface ReceiptViewProps {
  sale: Sale;
}

const paymentLabels: Record<string, string> = {
  CASH: "Cash",
  MPESA: "M-Pesa",
  "M-PESA": "M-Pesa",
  BANK_TRANSFER: "Bank Transfer",
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  VISA: "Visa",
  MASTERCARD: "MasterCard",
  SPLIT: "Split Payment",
  STORE_CREDIT: "Store Credit",
  QR_PAYMENT: "QR Payment",
  DIGITAL_WALLET: "Digital Wallet",
};

export default function ReceiptView({ sale }: ReceiptViewProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [sale]);

  const items = sale?.items || [];
  const totalItems = items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const subtotal = Number(
    sale?.totals?.subtotal ??
    sale?.subtotal ??
    0
  );

  const vat = Number(
    sale?.totals?.vat ??
    sale?.vat ??
    0
  );

  const discount = Number(
    sale?.totals?.discount ??
    sale?.discount ??
    sale?.discountAmount ??
    0
  );

  const grandTotal = Number(
    sale?.totals?.total ??
    sale?.total ??
    sale?.totalAmount ??
    0
  );

  const amountReceived = Number(
    sale?.payment?.amountReceived ??
    grandTotal
  );

  const changeDue = Number(
    sale?.payment?.change ??
    Math.max(0, amountReceived - grandTotal)
  );

  const rawPaymentMethod = String(
    sale?.payment?.method ||
    sale?.paymentMethod ||
    sale?.payment_method ||
    "CASH"
  ).toUpperCase();

  const formattedPayment = paymentLabels[rawPaymentMethod] || rawPaymentMethod;

  const loyaltyPointsEarned = sale?.customerId || sale?.customer_id
    ? Math.floor(grandTotal / 100)
    : 0;

  if (!sale) return null;

  return (
    <div
      id="printable-receipt"
      className="receipt-print bg-white text-black mx-auto p-3 font-mono text-[11px] leading-tight select-none"
      style={{
        width: "80mm",
        minHeight: "auto",
      }}
    >
      {/* ================= HEADER ================= */}
      <div className="text-center">
        <div className="flex justify-center mb-1">
          <Store className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-extrabold tracking-wide">
          SmartOps AI
        </h1>

        <p className="text-[10px] text-gray-700">
          Enterprise Inventory & POS
        </p>

        <div className="border-y border-dashed border-black my-2 py-2">
          <p className="font-semibold text-[10px] uppercase">Receipt No.</p>
          <p className="font-bold break-all">
            {sale.receiptNumber || sale.receipt_number || "N/A"}
          </p>
          <p className="mt-1 text-[10px]">
            {sale.createdAt || sale.created_at
              ? new Date(sale.createdAt || sale.created_at!).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* ================= STORE INFO ================= */}
      <div className="space-y-1 mb-3">
        <div className="flex justify-between">
          <span>Store</span>
          <span className="font-semibold">SmartOps Main Branch</span>
        </div>

        <div className="flex justify-between">
          <span>Terminal</span>
          <span className="font-semibold">POS-01</span>
        </div>

        <div className="flex justify-between">
          <span>Customer</span>
          <span className="font-semibold text-right ml-3 truncate">
            {sale.customer?.name || sale.customerName || sale.customer_name || "Walk-in Customer"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Cashier</span>
          <span className="font-semibold">
            {sale.cashier || sale.cashier_name || "Admin"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Payment</span>
          <span className="font-semibold">{formattedPayment}</span>
        </div>
      </div>

      <hr className="border-dashed border-black" />

      {/* ================= ITEMS ================= */}
      <table className="w-full mt-2 text-[11px]">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left py-1">Item</th>
            <th className="text-center py-1">Qty</th>
            <th className="text-right py-1">Total</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, idx) => {
            const itemPrice = Number(item.unitPrice || item.unit_price || 0);
            const itemTotal = Number(
              item.total ||
              item.subtotal ||
              itemPrice * (item.quantity || 1)
            );

            return (
              <tr key={item.id || item.productId || idx} className="align-top border-b border-slate-100">
                <td className="py-1 pr-1">
                  <div className="font-medium break-words">
                    {item.name || item.productName || item.product_name || "Item"}
                  </div>
                  <div className="text-[9px] text-gray-600">
                    {item.quantity} × KSh {itemPrice.toFixed(2)}
                  </div>
                </td>

                <td className="text-center py-1 font-medium">
                  {item.quantity}
                </td>

                <td className="text-right py-1 whitespace-nowrap font-medium">
                  KSh {itemTotal.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <hr className="border-dashed border-black mt-2" />

      {/* ================= TOTALS ================= */}
      <div className="space-y-1 mt-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>KSh {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>VAT (16%)</span>
          <span>KSh {vat.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Discount</span>
          <span>KSh {discount.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-y border-black py-2 mt-2">
        <div className="flex justify-between text-lg font-extrabold">
          <span>TOTAL</span>
          <span>KSh {grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* ================= PAYMENT & REMIT ================= */}
      <div className="space-y-1 mt-2">
        <div className="flex justify-between">
          <span>Amount Paid</span>
          <span>KSh {amountReceived.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Change</span>
          <span>KSh {changeDue.toFixed(2)}</span>
        </div>
      </div>

      <hr className="border-dashed border-black mt-3" />

      {/* ================= RECEIPT & LOYALTY SUMMARY ================= */}
      <div className="mt-2 text-[10px] space-y-1">
        <div className="flex justify-between">
          <span>Items Purchased</span>
          <span>{totalItems}</span>
        </div>

        {loyaltyPointsEarned > 0 && (
          <div className="flex justify-between font-bold text-emerald-800">
            <span>Loyalty Points Earned</span>
            <span>+{loyaltyPointsEarned} pts</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Verification Code</span>
          <span className="font-semibold">
            {sale.receiptNumber || sale.receipt_number || "N/A"}
          </span>
        </div>
      </div>

      <hr className="border-dashed border-black mt-3" />

      {/* ================= FOOTER ================= */}
      <div className="text-center mt-3 space-y-1">
        <p className="font-bold">Thank you for your business!</p>

        <p className="text-[9px]">
          Returns accepted within 7 days with valid receipt.
        </p>

        <p className="text-[9px] text-gray-600 mt-2">
          Powered by SmartOps AI Enterprise POS
        </p>
      </div>
    </div>
  );
}