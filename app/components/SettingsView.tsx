"use client";

import React, { useState } from "react";
import {
  Save,
  RotateCcw,
  Database,
  Bot,
  HardDrive,
  Shield,
  ShieldCheck,
  Building2,
  MapPin,
  Users,
  UserCheck,
  Printer,
  Package,
  Receipt,
  Sparkles,
  Lock,
  CloudUpload,
  Info,
  Plus,
  CheckCircle2,
  Server,
  DollarSign,
  Sliders
} from "lucide-react";

/* ===========================================================
   INTERFACES
=========================================================== */

export interface SystemStatus {
  id: string;
  name: string;
  status: "Operational" | "Degraded" | "Maintenance";
  latency: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgLight: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  manager: string;
  phone: string;
  address: string;
  inventoryCount: number;
  employeeCount: number;
  status: "Active" | "Inactive";
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Manager" | "Cashier" | "Inventory" | "Procurement" | "Accountant" | "Auditor";
  status: "Active" | "Suspended" | "Pending";
  branch: string;
  permissions: string;
  lastLogin: string;
  avatar: string;
}

export interface RolePermission {
  id: string;
  role: string;
  description: string;
  usersCount: number;
  accessLevel: "Full System" | "Branch Operations" | "Restricted Terminal" | "Read Only";
  modules: string[];
}

export interface NotificationSetting {
  id: string;
  channel: string;
  enabled: boolean;
  frequency: string;
  recipient: string;
}

/* ===========================================================
   MOCK ENTERPRISE DATA
=========================================================== */

const INITIAL_SYSTEM_STATUS: SystemStatus[] = [
  {
    id: "sys-1",
    name: "Enterprise Database",
    status: "Operational",
    latency: "12ms",
    icon: Database,
    accentColor: "text-emerald-600",
    bgLight: "bg-emerald-50"
  },
  {
    id: "sys-2",
    name: "Core API Gateway",
    status: "Operational",
    latency: "24ms",
    icon: Server,
    accentColor: "text-indigo-600",
    bgLight: "bg-indigo-50"
  },
  {
    id: "sys-3",
    name: "Gemini 1.5 Pro AI",
    status: "Operational",
    latency: "120ms",
    icon: Bot,
    accentColor: "text-purple-600",
    bgLight: "bg-purple-50"
  },
  {
    id: "sys-4",
    name: "Cloud Storage",
    status: "Operational",
    latency: "45ms",
    icon: HardDrive,
    accentColor: "text-blue-600",
    bgLight: "bg-blue-50"
  },
  {
    id: "sys-5",
    name: "License & Auth",
    status: "Operational",
    latency: "18ms",
    icon: ShieldCheck,
    accentColor: "text-teal-600",
    bgLight: "bg-teal-50"
  },
  {
    id: "sys-6",
    name: "Security Engine",
    status: "Operational",
    latency: "8ms",
    icon: Shield,
    accentColor: "text-rose-600",
    bgLight: "bg-rose-50"
  }
];

const INITIAL_BRANCHES: Branch[] = [
  {
    id: "br-1",
    name: "Nairobi Main Store & Hub",
    code: "NBI-MAIN",
    manager: "Jamal Anjuri",
    phone: "+254 712 345 678",
    address: "Kenyatta Avenue, Nairobi CBD",
    inventoryCount: 14200,
    employeeCount: 24,
    status: "Active"
  },
  {
    id: "br-2",
    name: "Thika Regional Depot",
    code: "THK-DEPOT",
    manager: "Mercy Makokha",
    phone: "+254 722 987 654",
    address: "Garissa Road, Thika Industrial Area",
    inventoryCount: 8900,
    employeeCount: 12,
    status: "Active"
  },
  {
    id: "br-3",
    name: "Mombasa Coastal Hub",
    code: "MBA-COAST",
    manager: "Tony Gitau",
    phone: "+254 733 456 789",
    address: "Moi Avenue, Mombasa",
    inventoryCount: 6500,
    employeeCount: 10,
    status: "Active"
  }
];

const INITIAL_USERS: UserAccount[] = [
  {
    id: "usr-1",
    name: "Jamal Anjuri",
    email: "jamal.anjuri@smartops.co.ke",
    role: "Administrator",
    status: "Active",
    branch: "Nairobi Main Store & Hub",
    permissions: "Super Admin (Full Root Access)",
    lastLogin: "Today, 05:12 AM",
    avatar: "JA"
  },
  {
    id: "usr-2",
    name: "Mercy Mwende Makokha",
    email: "mercy.makokha@smartops.co.ke",
    role: "Manager",
    status: "Active",
    branch: "Thika Regional Depot",
    permissions: "Branch Admin & Approvals",
    lastLogin: "Yesterday, 04:45 PM",
    avatar: "MM"
  },
  {
    id: "usr-3",
    name: "Tony Gitau",
    email: "tony.gitau@smartops.co.ke",
    role: "Procurement",
    status: "Active",
    branch: "Mombasa Coastal Hub",
    permissions: "Supplier & PO Operations",
    lastLogin: "July 21, 2026",
    avatar: "TG"
  },
  {
    id: "usr-4",
    name: "David Ochieng",
    email: "david.ochieng@smartops.co.ke",
    role: "Cashier",
    status: "Active",
    branch: "Nairobi Main Store & Hub",
    permissions: "POS Terminal & Sales Only",
    lastLogin: "Today, 06:00 AM",
    avatar: "DO"
  },
  {
    id: "usr-5",
    name: "Sarah Wambui",
    email: "sarah.wambui@smartops.co.ke",
    role: "Accountant",
    status: "Active",
    branch: "Nairobi Main Store & Hub",
    permissions: "Financials & Tax Ledgers",
    lastLogin: "July 20, 2026",
    avatar: "SW"
  }
];

const INITIAL_ROLES: RolePermission[] = [
  {
    id: "role-1",
    role: "Administrator",
    description: "Complete control over platform settings, financial ledgers, and system configurations.",
    usersCount: 2,
    accessLevel: "Full System",
    modules: ["All Modules Enabled"]
  },
  {
    id: "role-2",
    role: "Manager",
    description: "Operational management of inventory, staff shifts, local expenses, and sales.",
    usersCount: 3,
    accessLevel: "Branch Operations",
    modules: ["Sales", "Inventory", "Expenses", "Purchasing", "Reports"]
  },
  {
    id: "role-3",
    role: "Cashier",
    description: "Front-line POS transaction terminal processing, receipt printing, and customer receipts.",
    usersCount: 8,
    accessLevel: "Restricted Terminal",
    modules: ["POS Sales Terminal", "Receipts"]
  },
  {
    id: "role-4",
    role: "Inventory Manager",
    description: "Stock adjustment, warehouse tracking, barcode creation, and low stock threshold alerts.",
    usersCount: 4,
    accessLevel: "Branch Operations",
    modules: ["Inventory", "Purchasing", "Suppliers"]
  },
  {
    id: "role-5",
    role: "Procurement Officer",
    description: "Managing supplier credit limits, purchase orders, price lists, and volume rebate claims.",
    usersCount: 2,
    accessLevel: "Branch Operations",
    modules: ["Suppliers", "Purchasing", "Inventory Reports"]
  },
  {
    id: "role-6",
    role: "Accountant",
    description: "Managing operational expense policies, KRA VAT tax ledgers, and financial summaries.",
    usersCount: 2,
    accessLevel: "Full System",
    modules: ["Expenses", "Reports", "Tax Ledger", "POS History"]
  },
  {
    id: "role-7",
    role: "Auditor",
    description: "Read-only verification of transaction histories, audit logs, and compliance records.",
    usersCount: 1,
    accessLevel: "Read Only",
    modules: ["Audit Logs", "Reports", "Sales History"]
  }
];

/* ===========================================================
   COMPONENT
=========================================================== */

export default function SettingsView() {
  // Navigation Active Tab State
  const [activeTab, setActiveCategoryTab] = useState<string>("general");

  // Company Profile Form State
  const [companyName, setCompanyName] = useState<string>("Mid-Town Net Enterprises");
  const [legalName, setLegalName] = useState<string>("Mid-Town Net Solutions Limited");
  const [kraPin, setKraPin] = useState<string>("P051239874X");
  const [vatNumber, setVatNumber] = useState<string>("VAT-KE-0098412");
  const [regNumber, setRegNumber] = useState<string>("CPR/2025/119842");
  const [phone, setPhone] = useState<string>("+254 712 345 678");
  const [email, setEmail] = useState<string>("info@midtown.co.ke");
  const [website, setWebsite] = useState<string>("www.midtown.co.ke");
  const [currency, setCurrency] = useState<string>("KSh");

  // POS Settings State
  const [receiptPrinter, setReceiptPrinter] = useState<string>("Epson TM-T88VI Thermal Printer");
  const [barcodeScanner, setBarcodeScanner] = useState<string>("Honeywell Voyager 1200g USB");
  const [receiptFooter, setReceiptFooter] = useState<string>("Thank you for shopping with Mid-Town Net. Goods once sold are only returnable under ETIMS receipt policy.");
  const [offlineMode, setOfflineMode] = useState<boolean>(true);
  const [receiptSize, setReceiptSize] = useState<string>("80mm Thermal Paper");
  const [showTaxOnReceipt, setShowTaxOnReceipt] = useState<boolean>(true);
  const [autoPrintReceipt, setAutoPrintReceipt] = useState<boolean>(true);

  // Inventory Settings State
  const [useFifo, setFifo] = useState<boolean>(true);
  const [allowNegativeStock, setAllowNegativeStock] = useState<boolean>(false);
  const [expiryAlertDays, setExpiryAlertDays] = useState<number>(30);
  const [autoReorder, setAutoReorder] = useState<boolean>(true);
  const [defaultLowStockLimit, setDefaultLowStockLimit] = useState<number>(25);

  // Expense Policy State
  const [approvalThreshold, setApprovalThreshold] = useState<string>("KSh 50,000");
  const [enforceBudgetControls, setEnforceBudgetControls] = useState<boolean>(true);
  const [paymentTerms, setPaymentTerms] = useState<string>("Net 30 Days");

  // Tax Configuration State
  const [vatRate, setVatRate] = useState<number>(16.0);
  const [withholdingTaxRate, setWithholdingTaxRate] = useState<number>(2.0);
  const [etimsStatus, setEtimsStatus] = useState<boolean>(true);

  // AI Configuration State
  const [aiModel, setAiModel] = useState<string>("Gemini 1.5 Pro Enterprise");
  const [aiTemperature, setAiTemperature] = useState<number>(0.2);
  const [executiveMode, setExecutiveMode] = useState<boolean>(true);
  const [predictiveForecasting, setPredictiveForecasting] = useState<boolean>(true);
  const [autoReportGeneration, setAutoReportGeneration] = useState<boolean>(true);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState<number>(90);

  // Security & Appearance State
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState<number>(30);

  // Save / Notification Feedback State
  const [isSaved, setIsSaved] = useState<boolean>(false);

  /* ===========================================================
     EVENT HANDLERS & HELPER FUNCTIONS
  =========================================================== */

  const handleSaveAll = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const handleResetDefaults = () => {
    setReceiptPrinter("Epson TM-T88VI Thermal Printer");
    setReceiptFooter("Thank you for shopping with Mid-Town Net.");
    setOfflineMode(true);
    setFifo(true);
    setAllowNegativeStock(false);
    setExpiryAlertDays(30);
    setAutoReorder(true);
    setVatRate(16.0);
    setAiTemperature(0.2);
  };

  /* ===========================================================
     JSX RETURN
  =========================================================== */

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ===================================================
          1. ENTERPRISE HEADER
      =================================================== */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <Sliders className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Settings
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Enterprise Admin
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-100">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> SmartOps v4.2
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Global Platform Configuration Center, Security Policies, AI Directives & Integration Control.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isSaved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 animate-fade-in">
                <CheckCircle2 className="h-4 w-4" /> All Changes Saved
              </span>
            )}
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 focus:outline-hidden"
            >
              <RotateCcw className="h-4 w-4 text-slate-500" />
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-indigo-700 focus:outline-hidden active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              Save All Changes
            </button>
          </div>
        </div>
      </div>

      {/* ===========================================================
          2. PLATFORM STATUS CARDS
      =========================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {INITIAL_SYSTEM_STATUS.map((sys) => {
          const IconComponent = sys.icon;
          return (
            <div
              key={sys.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-xl p-2 ${sys.bgLight} ${sys.accentColor}`}>
                  <IconComponent className="h-4 w-4" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {sys.status}
                </span>
              </div>
              <h3 className="mt-3 text-xs font-bold text-slate-900">{sys.name}</h3>
              <p className="mt-0.5 text-[11px] font-mono text-slate-400">Latency: {sys.latency}</p>
            </div>
          );
        })}
      </div>

      {/* NAVIGATION TAB STRIP */}
      <div className="flex border-b border-slate-200/80 overflow-x-auto gap-2 text-sm font-bold">
        {[
          { id: "general", label: "Company & Branches", icon: Building2 },
          { id: "users", label: "Users & Roles", icon: Users },
          { id: "pos", label: "POS & Inventory", icon: Printer },
          { id: "financials", label: "Tax & Expenses", icon: Receipt },
          { id: "ai", label: "AI Directives", icon: Bot },
          { id: "security", label: "Security & System", icon: Lock }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategoryTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <TabIcon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ===========================================================
          TAB SECTION 1: COMPANY PROFILE & BRANCHES
      =========================================================== */}
      {(activeTab === "general" || activeTab === "all") && (
        <div className="space-y-6">
          {/* COMPANY PROFILE */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Company & Corporate Credentials</h2>
                  <p className="text-xs text-slate-500">Legal business entity, KRA PIN, VAT, and official contact metadata.</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-400">ID: ORG-KE-2026-99</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Display Business Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Registered Legal Name</label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">KRA PIN Number</label>
                <input
                  type="text"
                  value={kraPin}
                  onChange={(e) => setKraPin(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-mono font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">VAT Registration No.</label>
                <input
                  type="text"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-mono font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Business Registration No.</label>
                <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-mono font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Primary Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Official Contact Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Corporate Website</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Operating Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="KSh">Kenyan Shilling (KSh)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="UGX">Ugandan Shilling (UGX)</option>
                  <option value="TZS">Tanzanian Shilling (TZS)</option>
                </select>
              </div>
            </div>
          </div>

          {/* BRANCH MANAGEMENT */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Branch & Regional Hub Network</h2>
                  <p className="text-xs text-slate-500">Active retail locations, regional warehouses, and assigned store managers.</p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                <Plus className="h-3.5 w-3.5" /> Add New Branch
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INITIAL_BRANCHES.map((b) => (
                <div key={b.id} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 relative space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{b.name}</span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {b.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">{b.address}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-400 block">Manager</span>
                      <span className="font-semibold text-slate-800">{b.manager}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Branch Code</span>
                      <span className="font-mono font-semibold text-indigo-600">{b.code}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Stock Units</span>
                      <span className="font-bold text-slate-800">{b.inventoryCount.toLocaleString()} SKUs</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Staff Count</span>
                      <span className="font-bold text-slate-800">{b.employeeCount} Members</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===========================================================
          TAB SECTION 2: USERS & ROLES
      =========================================================== */}
      {(activeTab === "users" || activeTab === "all") && (
        <div className="space-y-6">
          {/* USER MANAGEMENT TABLE */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">User Access Directory</h2>
                  <p className="text-xs text-slate-500">System user accounts, assigned roles, branch locks, and activity logs.</p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                <Plus className="h-3.5 w-3.5" /> Invite New User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6 font-semibold">User</th>
                    <th className="py-3.5 px-4 font-semibold">Assigned Role</th>
                    <th className="py-3.5 px-4 font-semibold">Branch Lock</th>
                    <th className="py-3.5 px-4 font-semibold">Permissions</th>
                    <th className="py-3.5 px-4 font-semibold">Last Login</th>
                    <th className="py-3.5 px-4 text-center font-semibold">Status</th>
                    <th className="py-3.5 px-6 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {INITIAL_USERS.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                            {usr.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{usr.name}</p>
                            <p className="text-xs text-slate-400">{usr.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">{usr.role}</td>
                      <td className="py-4 px-4 text-slate-600 text-xs">{usr.branch}</td>
                      <td className="py-4 px-4 text-xs font-mono text-indigo-600">{usr.permissions}</td>
                      <td className="py-4 px-4 text-xs text-slate-500">{usr.lastLogin}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                          {usr.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-indigo-600 font-semibold text-xs">
                          <button type="button" className="hover:underline">Edit</button>
                          <span>•</span>
                          <button type="button" className="hover:underline text-rose-600">Revoke</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ROLES & PERMISSIONS */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-teal-50 p-2.5 text-teal-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Role Hierarchy & Permission Matrices</h2>
                  <p className="text-xs text-slate-500">Defined operational security levels across terminal and admin modules.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INITIAL_ROLES.map((role) => (
                <div key={role.id} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{role.role}</span>
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                      {role.usersCount} Users Assigned
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{role.description}</p>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Access Level:</span>
                    <span className="font-semibold text-indigo-600">{role.accessLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===========================================================
          TAB SECTION 3: POS & INVENTORY
      =========================================================== */}
      {(activeTab === "pos" || activeTab === "all") && (
        <div className="space-y-6">
          {/* POS TERMINAL CONFIGURATION */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                  <Printer className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Point-of-Sale (POS) Hardware & Receipt Setup</h2>
                  <p className="text-xs text-slate-500">Thermal printers, barcode scanners, offline sync, and customer receipt policies.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Primary Thermal Receipt Printer</label>
                <input
                  type="text"
                  value={receiptPrinter}
                  onChange={(e) => setReceiptPrinter(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Barcode Scanner Device</label>
                <input
                  type="text"
                  value={barcodeScanner}
                  onChange={(e) => setBarcodeScanner(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Paper Roll Width Format</label>
                <select
                  value={receiptSize}
                  onChange={(e) => setReceiptSize(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="80mm Thermal Paper">80mm Standard Thermal Roll</option>
                  <option value="58mm Compact Thermal">58mm Compact Thermal Roll</option>
                  <option value="A4 Invoice Printer">A4 Laser Document Sheet</option>
                </select>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-700">Custom Receipt Footer Message</label>
                <textarea
                  rows={2}
                  value={receiptFooter}
                  onChange={(e) => setReceiptFooter(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Offline POS Sales Caching</p>
                  <p className="text-[11px] text-slate-500">Buffer sales locally if internet disconnects</p>
                </div>
                <input
                  type="checkbox"
                  checked={offlineMode}
                  onChange={(e) => setOfflineMode(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Break Down VAT 16% on Receipt</p>
                  <p className="text-[11px] text-slate-500">Display itemized tax breakdown</p>
                </div>
                <input
                  type="checkbox"
                  checked={showTaxOnReceipt}
                  onChange={(e) => setShowTaxOnReceipt(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Auto-Print Receipt Upon Checkout</p>
                  <p className="text-[11px] text-slate-500">Trigger printer immediately on payment</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoPrintReceipt}
                  onChange={(e) => setAutoPrintReceipt(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* INVENTORY SETTINGS */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Inventory Control & Valuation Policies</h2>
                  <p className="text-xs text-slate-500">FIFO tracking, stock limits, expiration alerts, and warehouse rules.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Enforce FIFO Costing Valuation</p>
                  <p className="text-[11px] text-slate-500">First-In First-Out cost deduction</p>
                </div>
                <input
                  type="checkbox"
                  checked={useFifo}
                  onChange={(e) => setFifo(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Allow Negative Inventory Stock</p>
                  <p className="text-[11px] text-slate-500">Allow sales when count reaches 0</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowNegativeStock}
                  onChange={(e) => setAllowNegativeStock(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Auto-Draft Purchase Requisitions</p>
                  <p className="text-[11px] text-slate-500">Draft POs when stock hits minimums</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoReorder}
                  onChange={(e) => setAutoReorder(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Expiration Early Warning Trigger (Days)</label>
                <input
                  type="number"
                  value={expiryAlertDays}
                  onChange={(e) => setExpiryAlertDays(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Default Low Stock Reorder Threshold</label>
                <input
                  type="number"
                  value={defaultLowStockLimit}
                  onChange={(e) => setDefaultLowStockLimit(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===========================================================
          TAB SECTION 4: TAX & EXPENSES
      =========================================================== */}
      {(activeTab === "financials" || activeTab === "all") && (
        <div className="space-y-6">
          {/* TAX CONFIGURATION */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Tax Rates & KRA ETIMS Compliance</h2>
                  <p className="text-xs text-slate-500">VAT input/output tracking, withholding tax certificates, and statutory parameters.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" /> KRA ETIMS Live Connected
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Standard Value Added Tax (VAT %)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Withholding Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={withholdingTaxRate}
                  onChange={(e) => setWithholdingTaxRate(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Enable Automated KRA ETIMS Transmission</p>
                  <p className="text-[11px] text-slate-500">Sync sales receipts directly to tax ledger</p>
                </div>
                <input
                  type="checkbox"
                  checked={etimsStatus}
                  onChange={(e) => setEtimsStatus(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* EXPENSE POLICIES */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Expense Disbursal & Budget Controls</h2>
                  <p className="text-xs text-slate-500">Approval thresholds for petty cash, rent, utility payments, and staff advances.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Single Manager Approval Ceiling</label>
                <input
                  type="text"
                  value={approvalThreshold}
                  onChange={(e) => setApprovalThreshold(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Default Supplier Payment Terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="Net 14 Days">Net 14 Days</option>
                  <option value="Net 30 Days">Net 30 Days</option>
                  <option value="Net 60 Days">Net 60 Days</option>
                  <option value="Immediate Cash on Delivery">Immediate Cash on Delivery</option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Enforce Hard Departmental Budgets</p>
                  <p className="text-[11px] text-slate-500">Block payouts exceeding monthly allocation</p>
                </div>
                <input
                  type="checkbox"
                  checked={enforceBudgetControls}
                  onChange={(e) => setEnforceBudgetControls(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===========================================================
          TAB SECTION 5: AI DIRECTIVES
      =========================================================== */}
      {(activeTab === "ai" || activeTab === "all") && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">SmartOps AI Assistant Directives</h2>
                  <p className="text-xs text-slate-500">Gemini 1.5 Pro model parameters, executive briefing modes, and automated analytics.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
                <Sparkles className="h-3.5 w-3.5 text-purple-600" /> Gemini Pro Active
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Core Language Model</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="Gemini 1.5 Pro Enterprise">Gemini 1.5 Pro Enterprise (High Accuracy)</option>
                  <option value="Gemini 1.5 Flash Ultra-Fast">Gemini 1.5 Flash Ultra-Fast (Low Latency)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Model Temperature (Creativity Index)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.0"
                  max="1.0"
                  value={aiTemperature}
                  onChange={(e) => setAiTemperature(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Min Confidence Threshold (%)</label>
                <input
                  type="number"
                  value={aiConfidenceThreshold}
                  onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Executive Summary Mode</p>
                  <p className="text-[11px] text-slate-500">Deliver concise CEO & CFO briefings</p>
                </div>
                <input
                  type="checkbox"
                  checked={executiveMode}
                  onChange={(e) => setExecutiveMode(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Predictive Revenue Forecasting</p>
                  <p className="text-[11px] text-slate-500">Run 30-day continuous sales modeling</p>
                </div>
                <input
                  type="checkbox"
                  checked={predictiveForecasting}
                  onChange={(e) => setPredictiveForecasting(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Auto-Generate Weekly PDF Briefings</p>
                  <p className="text-[11px] text-slate-500">Compile executive report every Sunday</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoReportGeneration}
                  onChange={(e) => setAutoReportGeneration(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===========================================================
          TAB SECTION 6: SECURITY & SYSTEM
      =========================================================== */}
      {(activeTab === "security" || activeTab === "all") && (
        <div className="space-y-6">
          {/* SECURITY POLICIES */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Security Policies & Authentication</h2>
                  <p className="text-xs text-slate-500">Two-factor authentication, session timeouts, and IP whitelisting.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 bg-slate-50/40">
                <div>
                  <p className="text-xs font-bold text-slate-900">Mandatory 2FA for Admins & Managers</p>
                  <p className="text-[11px] text-slate-500">SMS / Authenticator app code required</p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Inactivity Session Timeout (Minutes)</label>
                <input
                  type="number"
                  value={sessionTimeoutMinutes}
                  onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* BACKUP & SYSTEM INFO */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <CloudUpload className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Cloud Backup & Recovery</h3>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4">Last automatic backup completed today at 03:00 AM (2.4 GB encrypted archive).</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => alert("Creating encrypted system snapshot...")}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Create Immediate Backup
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Download Archives
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900">System Build Metadata</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-600">
                <div>Framework: Next.js 16 App Router</div>
                <div>Runtime: React 19 Strict</div>
                <div>UI Engine: TailwindCSS + Lucide</div>
                <div>License: Enterprise Perpetual</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===========================================================
          FOOTER ACTION BAR
      =========================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Global Configuration Sync</h3>
          <p className="text-xs text-slate-500">Apply settings instantly across all POS terminals, regional hubs, and mobile apps.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel Changes
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-all"
          >
            <Save className="h-4 w-4" />
            Commit Configuration
          </button>
        </div>
      </div>
    </div>
  );
}