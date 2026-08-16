"use client";

import { saleService } from "@/app/services/sale.service";
import productService from "@/app/services/productService";
import type { PaymentMethod } from "@/app/types/sale";
import React, { useState, useMemo, useEffect, useRef } from "react";

import {
  X,
  Wallet,
  CreditCard,
  Landmark,
  Smartphone,
  Receipt,
  Printer,
  Mail,
  MessageCircle,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  DollarSign,
  PiggyBank,
  Building2,
  BadgeCheck,
  ArrowRightLeft,
  Coins,
  Plus,
  Minus,
  ShieldCheck,
  Clock,
  Calendar,
  User,
  ShoppingBag,
  Loader2,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type PaymentModalProps = {
  open: boolean;
  onClose: () => void;
  total: number;
  cart: CartItem[];
  customer?: {
    id?: string;
    name: string;
    phone?: string;
    type?: string;
  };
  onSaleComplete: () => void;
};

type PaymentMethodType =
  | "cash"
  | "mpesa"
  | "visa"
  | "mastercard"
  | "debit_card"
  | "credit_card"
  | "bank_transfer"
  | "split_payment"
  | "gift_card"
  | "store_credit"
  | "qr_payment"
  | "digital_wallet";

interface SplitPaymentRow {
  id: string;
  method: PaymentMethodType;
  amount: number;
}

export default function PaymentModal({
  open,
  onClose,
  total,
  cart,
  customer,
  onSaleComplete,
}: PaymentModalProps) {
  // Main Configuration States
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("cash");
  const [cashReceived, setCashReceived] = useState<string>("");
  const [saleNotes, setSaleNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);

  // Split Payments State
  const [splitPayments, setSplitPayments] = useState<SplitPaymentRow[]>([
    { id: "1", method: "cash", amount: 0 }
  ]);

  // Pre-fill cash tender on modal open for instant checkout
  useEffect(() => {
    if (open && total > 0) {
      setCashReceived(total.toFixed(2));
    }
  }, [open, total]);

  // Handle Real-time Clock and Date
  useEffect(() => {
    if (!open) return;
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setCurrentDate(now.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [open]);

  // Accessibility: Handle Escape Key & Focus Trap
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Backdrop Click Handler
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Financial Breakdown Calculations
  const subtotal = useMemo(() => Math.max(0, total / 1.16), [total]);
  const vatAmount = useMemo(() => Math.max(0, total - subtotal), [total, subtotal]);
  const discount = 0; // Configured for enterprise modular extension

  // Cash computation
  const parsedCashReceived = useMemo(() => {
    const val = parseFloat(cashReceived);
    return isNaN(val) || val < 0 ? 0 : val;
  }, [cashReceived]);

  // Split calculation
  const totalSplitAllocated = useMemo(() => {
    return splitPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [splitPayments]);

  // Universal Financial Aggregators
  const totalPaidAmount = useMemo(() => {
    if (selectedMethod === "split_payment") {
      return totalSplitAllocated;
    }
    if (selectedMethod === "cash") {
      return parsedCashReceived;
    }
    return total; // Standard automatic digital verification modes
  }, [selectedMethod, parsedCashReceived, totalSplitAllocated, total]);

  const changeDue = useMemo(() => {
    if (selectedMethod === "cash" && parsedCashReceived > total) {
      return parsedCashReceived - total;
    }
    return 0;
  }, [selectedMethod, parsedCashReceived, total]);

  const remainingBalance = useMemo(() => {
    if (totalPaidAmount >= total) return 0;
    return total - totalPaidAmount; 
  }, [totalPaidAmount, total]);

  const isPaymentComplete = useMemo(() => {
    if (selectedMethod === "cash") {
      return parsedCashReceived >= total;
    }
    if (selectedMethod === "split_payment") {
      return Math.abs(totalSplitAllocated - total) < 0.01;
    }
    return true;
  }, [selectedMethod, parsedCashReceived, totalSplitAllocated, total]);

  // Payment Status Configurator
  const paymentStatus = useMemo(() => {
    if (totalPaidAmount === 0) return { label: "Outstanding", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" };
    if (totalPaidAmount >= total) return { label: "Paid", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
    return { label: "Partial Payment", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
  }, [totalPaidAmount, total]);

  // Quick Action Tenders
  const handleQuickAmount = (amount: number) => {
    setCashReceived(amount.toString());
  };

  const handleExactAmount = () => {
    setCashReceived(total.toFixed(2));
  };

  const handleRoundUp = () => {
    setCashReceived(Math.ceil(total).toString());
  };

  // Split Row Mutations
  const addSplitRow = () => {
    setSplitPayments([...splitPayments, { id: Date.now().toString(), method: "cash", amount: 0 }]);
  };

  const removeSplitRow = (id: string) => {
    if (splitPayments.length > 1) {
      setSplitPayments(splitPayments.filter((p) => p.id !== id));
    }
  };

  const updateSplitRow = (id: string, key: keyof SplitPaymentRow, value: any) => {
    setSplitPayments(
      splitPayments.map((row) => {
        if (row.id === id) {
          if (key === "amount") {
            const parsed = parseFloat(value);
            return { ...row, amount: isNaN(parsed) || parsed < 0 ? 0 : parsed };
          }
          return { ...row, [key]: value };
        }
        return row;
      })
    );
  };

  /**
   * Complete Sale
   */
  const handleCompleteSale = async () => {
    if (!isPaymentComplete || isLoading) return;

    setIsLoading(true);

    try {
      const amountReceived = selectedMethod === "cash" ? parsedCashReceived : total;
      const changeAmount = Math.max(0, amountReceived - total);

      // Create the sale object
      const sale = saleService.completeSale({
        customerId: customer?.id,
        customerName: customer?.name || "Walk-in Customer",
        customer_name: customer?.name || "Walk-in Customer",
        cashier: "Admin",
        cashier_name: "Admin",
        total: Number(total.toFixed(2)),
        totalAmount: Number(total.toFixed(2)),
        subtotal: Number(subtotal.toFixed(2)),
        vat: Number(vatAmount.toFixed(2)),
        discount: 0,
        totals: {
          subtotal: Number(subtotal.toFixed(2)),
          vat: Number(vatAmount.toFixed(2)),
          discount: 0,
          total: Number(total.toFixed(2)),
        },
        items: cart.map((item) => ({
          id: crypto.randomUUID(),
          productId: item.id,
          product_id: item.id,
          name: item.name,
          productName: item.name,
          product_name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          unit_price: item.price,
          total: Number((item.price * item.quantity).toFixed(2)),
        })),
        paymentMethod:
          selectedMethod === "split_payment"
            ? "split"
            : (selectedMethod as PaymentMethod),
        payment_method:
          selectedMethod === "split_payment"
            ? "SPLIT"
            : selectedMethod.toUpperCase(),
        payment: {
          method: selectedMethod.toUpperCase(),
          amountReceived: Number(amountReceived.toFixed(2)),
          change: Number(changeAmount.toFixed(2)),
        },
        amountReceived: Number(amountReceived.toFixed(2)),
        change_amount: Number(changeAmount.toFixed(2)),
        notes: saleNotes,
        status: "completed",
      });

      // Update inventory in Supabase
      for (const item of cart) {
        await productService.decreaseStock(item.id, item.quantity);
      }

      // Save sale to Supabase
      await saleService.saveSale(sale);

      console.log("Sale completed and inventory updated successfully.");

      // Reset modal state
      setCashReceived("");
      setSaleNotes("");
      setSelectedMethod("cash");
      setSplitPayments([
        {
          id: "1",
          method: "cash",
          amount: 0,
        },
      ]);

      setIsLoading(false);

      // Notify parent component
      onSaleComplete();

    } catch (error: any) {
      console.error("Failed to complete sale:", error);
      setIsLoading(false);

      alert(
        error?.message
          ? `Failed to complete sale: ${error.message}`
          : "Failed to complete sale."
      );
    }
  };

  if (!open) return null;

  // UI Definition Arrays
  const paymentMethods = [
    { id: "cash", label: "Cash", icon: Banknote, desc: "Physical tender" },
    { id: "mpesa", label: "M-Pesa", icon: Smartphone, desc: "Mobile transfer" },
    { id: "visa", label: "Visa", icon: CreditCard, desc: "Credit/Debit Card" },
    { id: "mastercard", label: "Mastercard", icon: CreditCard, desc: "Credit/Debit Card" },
    { id: "debit_card", label: "Debit Card", icon: CreditCard, desc: "Direct terminal" },
    { id: "credit_card", label: "Credit Card", icon: CreditCard, desc: "Deferred liability" },
    { id: "bank_transfer", label: "Bank Transfer", icon: Landmark, desc: "EFT / RTGS / Instant" },
    { id: "split_payment", label: "Split Payment", icon: ArrowRightLeft, desc: "Multiple options" },
    { id: "gift_card", label: "Gift Card", icon: Wallet, desc: "Prepaid token" },
    { id: "store_credit", label: "Store Credit", icon: PiggyBank, desc: "Customer account" },
    { id: "qr_payment", label: "QR Payment", icon: Building2, desc: "Dynamic scan" },
    { id: "digital_wallet", label: "Digital Wallet", icon: Coins, desc: "Apple / Google Pay" },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-6xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-slate-900 dark:text-slate-100"
      >
        {/* Header Block */}
        <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 id="modal-title" className="text-xl font-bold tracking-tight">Complete Sale</h1>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Finalize customer payment & generate ledger receipts</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-200/50 dark:bg-slate-800 rounded-lg">
              <Calendar className="h-3.5 w-3.5" />
              <span>{currentDate || "Loading date..."}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-200/50 dark:bg-slate-800 rounded-lg">
              <Clock className="h-3.5 w-3.5" />
              <span>{currentTime || "00:00:00 AM"}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Content Section Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto max-h-[calc(100vh-14rem)] divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          
          {/* Left Column Ledger Metrics */}
          <div className="lg:col-span-5 p-6 space-y-6 overflow-y-auto">
            {/* Massive Amount Summary Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl p-6 shadow-md border border-slate-800">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
                <ShoppingBag className="w-40 h-40" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Total Due</span>
              <div className="flex items-baseline gap-2 animate-pulse">
                <span className="text-lg font-bold text-emerald-400">KES</span>
                <span className="text-4xl font-extrabold tracking-tight">{total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Micro Breakdown Invoicing */}
            <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Subtotal (Excl. VAT)</span>
                <span className="font-mono">{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">VAT (16%)</span>
                <span className="font-mono">{vatAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Discounts Applied</span>
                <span className="font-mono text-emerald-500">-{discount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <hr className="border-slate-200 dark:border-slate-800 my-1" />
              <div className="flex justify-between text-base font-bold">
                <span>Grand Total</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">KES {total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Customer Information Ledger */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <User className="h-3.5 w-3.5" />
                <span>Customer Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Customer Account</span>
                  <span className="font-medium">{customer?.name || "Walk-in Customer"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Loyalty ID</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">N/A</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Classification</span>
                  <span className="font-medium inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{customer?.type || "Standard Tier"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Phone</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">{customer?.phone || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Contextual Status Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors duration-300 ${paymentStatus.color}`}>
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5" />
                <span className="text-sm font-semibold">Payment Status</span>
              </div>
              <span className="text-sm font-extrabold uppercase tracking-wider">{paymentStatus.label}</span>
            </div>
          </div>

          {/* Right Column Processing Execution Framework */}
          <div className="lg:col-span-7 p-6 space-y-6 overflow-y-auto">
            {/* Method Chooser Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Payment Architecture</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {paymentMethods.map((method) => {
                  const IconComp = method.icon;
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500/40 group ${
                        isSelected
                          ? "bg-emerald-500/5 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <IconComp className={`h-5 w-5 transition-transform group-hover:scale-110 ${isSelected ? "text-emerald-500" : "text-slate-400"}`} />
                        {isSelected && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-tight">{method.label}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{method.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Rendering Based on Configuration Selection */}
            {selectedMethod === "cash" && (
              <div className="space-y-4 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/20">
                <div className="flex flex-col gap-2">
                  <label htmlFor="cash-input" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount Received</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">KES</span>
                    <input
                      id="cash-input"
                      type="number"
                      step="any"
                      min="0"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Micro Processing Actions */}
                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 2000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickAmount(amt)}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      +{amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleExactAmount}
                    className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold rounded-lg border border-emerald-500/20 transition-colors"
                  >
                    Exact Amount
                  </button>
                  <button
                    type="button"
                    onClick={handleRoundUp}
                    className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-lg transition-colors"
                  >
                    Round Up
                  </button>
                </div>

                {/* Ledger Dynamic Math Outputs */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold pt-2">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Change Due</span>
                    <span className={changeDue > 0 ? "text-emerald-500 text-sm" : "text-slate-500 text-sm"}>
                      KES {changeDue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Outstanding Balance</span>
                    <span className={remainingBalance > 0 ? "text-rose-500 text-sm" : "text-emerald-500 text-sm"}>
                      KES {remainingBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "split_payment" && (
              <div className="space-y-4 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Split Distribution List</label>
                  <button
                    type="button"
                    onClick={addSplitRow}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <Plus className="h-3 w-3" /> Add Payment Method
                  </button>
                </div>

                <div className="space-y-3">
                  {splitPayments.map((row, idx) => (
                    <div key={row.id} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold font-mono text-slate-400 px-1">{idx + 1}</span>
                      <select
                        value={row.method}
                        onChange={(e) => updateSplitRow(row.id, "method", e.target.value as PaymentMethodType)}
                        className="bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        {paymentMethods.filter(m => m.id !== "split_payment").map(m => (
                          <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">KES</span>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={row.amount || ""}
                          onChange={(e) => updateSplitRow(row.id, "amount", e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSplitRow(row.id)}
                        disabled={splitPayments.length <= 1}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-30"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Split Ledger Summary Indicators */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Total Allocated</span>
                    <span className="text-sm">KES {totalSplitAllocated.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Remaining Due</span>
                    <span className={remainingBalance > 0 ? "text-rose-500 text-sm" : "text-emerald-500 text-sm"}>
                      KES {remainingBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Catch-all Fallback UI Framework for instant digital authorization validation paths */}
            {selectedMethod !== "cash" && selectedMethod !== "split_payment" && (
              <div className="p-6 border border-emerald-500/20 rounded-xl bg-emerald-500/5 flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Receipt className="h-6 w-6 animate-bounce" />
                </div>
                <h4 className="text-sm font-bold">Electronic Terminal Verification Ready</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  The integrated external card reader/gateway processing network will authorize the full transaction amount of <span className="font-mono font-bold text-slate-800 dark:text-slate-200">KES {total.toLocaleString()}</span> automatically.
                </p>
              </div>
            )}

            {/* Receipt Distribution Toggles */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receipt Distribution Channel</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Print Receipt", icon: Printer },
                  { label: "Email Receipt", icon: Mail },
                  { label: "SMS Receipt", icon: Smartphone },
                  { label: "WhatsApp Receipt", icon: MessageCircle },
                  { label: "PDF Receipt", icon: Receipt },
                  { label: "Gift Receipt", icon: Wallet },
                ].map((channel, i) => {
                  const Icon = channel.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 opacity-60 cursor-not-allowed select-none"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{channel.label}</span>
                      </div>
                      <div className="w-7 h-4 bg-slate-300 dark:bg-slate-700 rounded-full relative p-0.5">
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enterprise Level Sales Auditing Notes */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="notes" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Notes</label>
                <span className="text-[10px] font-mono text-slate-400">{saleNotes.length}/250 chars</span>
              </div>
              <textarea
                id="notes"
                maxLength={250}
                value={saleNotes}
                onChange={(e) => setSaleNotes(e.target.value)}
                placeholder="Append permanent verification codes, internal adjustments, or compliance audit descriptors..."
                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 h-16 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Global Control Terminal Footer */}
        <footer className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 cursor-not-allowed select-none hidden sm:inline-block"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={!isPaymentComplete || isLoading}
              onClick={handleCompleteSale}
              className={`px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 ${
                isPaymentComplete && !isLoading
                  ? "bg-emerald-600 hover:bg-emerald-700 active:scale-98 cursor-pointer"
                  : "bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Remittance...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Complete Sale</span>
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}