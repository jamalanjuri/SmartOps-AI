"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Package,
  RefreshCw,
  Loader2,
  DollarSign,
  Zap,
  Building2,
} from "lucide-react";

import productService, { type Product } from "@/app/services/productService";
import { expenseService, type Expense } from "@/app/services/expense.service";
import {
  reportService,
  type FinancialMetrics,
} from "@/app/services/report.service";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function AIAssistantView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [financials, setFinancials] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    loadContextData();
  }, []);

  async function loadContextData() {
    try {
      setLoading(true);
      const [productList, expenseList, finData] = await Promise.all([
        productService.getProducts(),
        expenseService.getExpenses(),
        reportService.getFinancialSummary(),
      ]);

      setProducts(productList);
      setExpenses(expenseList);
      setFinancials(finData);

      // Initial AI Greeting & Automated Summary
      const lowStockCount = productList.filter((p) => p.stock <= ((p as any).minStock || 5)).length;
      const initialGreeting = `Hello Jamal! I've audited your live Supabase database. You currently have **${productList.length} products cataloged** (${lowStockCount} low stock alerts), **KES ${finData.totalRevenue.toLocaleString()} in gross revenue**, and **KES ${finData.totalExpenses.toLocaleString()} in operational expenses**. How can I assist your business operations today?`;

      setMessages([
        {
          id: "msg-1",
          sender: "ai",
          text: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: any) {
      console.error("Failed to initialize AI Assistant context:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsThinking(true);

    setTimeout(() => {
      const responseText = generateAIResponse(query);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 700);
  };

  const generateAIResponse = (prompt: string): string => {
    const lower = prompt.toLowerCase();

    if (lower.includes("stock") || lower.includes("inventory") || lower.includes("reorder")) {
      const lowStockItems = products.filter((p) => p.stock <= ((p as any).minStock || 5));
      if (lowStockItems.length === 0) {
        return "All catalog inventory levels are healthy! No items are currently below minimum stock thresholds.";
      }
      const itemNames = lowStockItems.map((p) => `• ${p.name} (Current Stock: ${p.stock})`).join("\n");
      return `⚠️ **Low Stock Reorder Alert**\n\nThe following ${lowStockItems.length} product(s) are critically low and require purchase orders:\n\n${itemNames}\n\n*Recommendation:* Issue purchase orders in the Purchasing module to avoid stockout downtime.`;
    }

    if (lower.includes("financial") || lower.includes("profit") || lower.includes("revenue") || lower.includes("margin")) {
      if (!financials) return "Financial data is currently updating. Please refresh.";
      return `📊 **Live Financial Health Assessment**\n\n• **Gross Revenue:** KES ${financials.totalRevenue.toLocaleString()}\n• **Cost of Goods Sold (COGS):** KES ${financials.totalCOGS.toLocaleString()}\n• **Gross Margin:** ${financials.grossMarginPercentage.toFixed(1)}%\n• **Operating Overhead:** KES ${financials.totalExpenses.toLocaleString()}\n• **Net Profit:** KES ${financials.netProfit.toLocaleString()}\n\n*Strategic Insight:* Your net margin is standing at **${financials.netMarginPercentage.toFixed(1)}%**. Managing procurement costs will directly expand bottom-line profits.`;
    }

    if (lower.includes("expense") || lower.includes("anomaly") || lower.includes("cost")) {
      const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);
      if (expenses.length === 0) {
        return "No operational expenses logged in database yet.";
      }
      const topExp = [...expenses].sort((a, b) => b.amount - a.amount)[0];
      return `💸 **Expense Analysis & Overhead Audit**\n\n• **Total Overhead Logged:** KES ${totalExp.toLocaleString()}\n• **Total Vouchers:** ${expenses.length}\n• **Highest Outlay:** KES ${topExp.amount.toLocaleString()} (${topExp.category} - "${topExp.description}")\n\n*Audit Signal:* Review weekly utility and transport logs to optimize fixed overhead.`;
    }

    return `SmartOps AI is tracking ${products.length} products, KES ${financials?.totalRevenue.toLocaleString()} in revenue, and KES ${financials?.totalExpenses.toLocaleString()} in expenses. Ask me about **low stock alerts**, **financial profit margins**, or **expense audits** for immediate actionable insights!`;
  };

  const lowStockCount = products.filter((p) => p.stock <= ((p as any).minStock || 5)).length;

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <Sparkles className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            <span>SmartOps AI Assistant</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time business intelligence, predictive stock reorder forecasts, and expense auditing.
          </p>
        </div>

        <button
          type="button"
          onClick={loadContextData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Sync Live Database
        </button>
      </div>

      {/* Real-time Business Signals Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Stock Reorder Alerts</p>
            <h4 className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
              {lowStockCount} Items
            </h4>
            <p className="text-[11px] text-slate-400">At or below reorder threshold</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400 shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Net Profit Margin</p>
            <h4 className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {financials ? `${financials.netMarginPercentage.toFixed(1)}%` : "0.0%"}
            </h4>
            <p className="text-[11px] text-slate-400">Calculated after COGS & overhead</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Audited Ledger</p>
            <h4 className="text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
              {products.length} Products
            </h4>
            <p className="text-[11px] text-slate-400">Live active inventory catalog</p>
          </div>
        </div>
      </div>

      {/* Recommended Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleSendMessage("Analyze low stock items and reorder priorities")}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500/10 hover:text-indigo-600 text-xs font-semibold transition border border-slate-200 dark:border-slate-700 flex items-center gap-2"
        >
          <Package className="h-3.5 w-3.5" />
          <span>Audit Reorder Priorities</span>
        </button>

        <button
          type="button"
          onClick={() => handleSendMessage("Give me a financial summary & profit margin assessment")}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-600 text-xs font-semibold transition border border-slate-200 dark:border-slate-700 flex items-center gap-2"
        >
          <DollarSign className="h-3.5 w-3.5" />
          <span>Summarize Net Profit Margins</span>
        </button>

        <button
          type="button"
          onClick={() => handleSendMessage("Identify recent top expenses and anomalies")}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:text-amber-600 text-xs font-semibold transition border border-slate-200 dark:border-slate-700 flex items-center gap-2"
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Inspect Operational Overhead</span>
        </button>
      </div>

      {/* Main Interactive Chat Panel */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Chat Messages Log */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-tl-none"
                }`}
              >
                <div>{msg.text}</div>
                <div
                  className={`mt-2 text-[10px] text-right ${
                    msg.sender === "user" ? "text-indigo-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span>Auditing live database ledgers...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask SmartOps AI about stock forecasts, profit margins, or expenses..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-3 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm transition flex items-center gap-2 shrink-0 shadow-md"
            >
              <Send className="h-4 w-4" />
              <span>Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}