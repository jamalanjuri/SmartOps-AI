"use client";

import {
  LayoutDashboard,
  ShoppingCart,
  History,
  Package,
  ShoppingBag,
  Users,
  Receipt,
  BarChart3,
  Bot,
  Settings,
  TrendingUp,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Sales", icon: ShoppingCart },
    { name: "Sales History", icon: History },
    { name: "Inventory", icon: Package },
    { name: "Purchasing", icon: ShoppingBag },
    { name: "Suppliers", icon: Users },
    { name: "Expenses", icon: Receipt },
    { name: "Reports", icon: BarChart3 },
    { name: "AI Assistant", icon: Bot },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col min-h-screen">
      {/* Prominent Value-Driven Brand Header */}
      <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-3.5">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
          <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-cyan-400" />
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-xl font-black tracking-tight text-white leading-tight">
            SmartOps <span className="text-cyan-400">AI</span>
          </span>
          <span className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
            Automated Business Intelligence
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}