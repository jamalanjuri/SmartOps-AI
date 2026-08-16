"use client";

import DashboardView from "./DashboardView";
import SalesView from "./SalesView";
import SalesHistoryView from "./SalesHistoryView";
import InventoryView from "./InventoryView";
import PurchasingView from "./PurchasingView";
import SuppliersView from "./SuppliersView";
import ExpensesView from "./ExpensesView";
import ReportsView from "./ReportsView";
import AIAssistantView from "./AIAssistantView";
import SettingsView from "./SettingsView";
type Props = {
  activePage: string;
};

export default function ContentView({
  activePage,
}: Props) {
  switch (activePage) {
    case "Dashboard":
      return <DashboardView />;

    case "Sales":
      return <SalesView />;

    case "Sales History":
      return <SalesHistoryView />;
case "Inventory":
  return <InventoryView />;
  case "Purchasing":
  return <PurchasingView />;
  case "Suppliers":
  return <SuppliersView />;
  case "Expenses":
  return <ExpensesView />;
  case "Reports":
  return <ReportsView />;
  case "AI Assistant":
    return <AIAssistantView />;
    case "Settings":
  return <SettingsView />;
    default:
      return (
        <div className="flex h-full items-center justify-center p-10">
          <div className="text-center">

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {activePage}
            </h1>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              This module is under development.
            </p>

          </div>
        </div>
      );
  }
}