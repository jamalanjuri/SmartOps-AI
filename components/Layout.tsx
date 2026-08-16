"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import ContentView from "../app/components/ContentView";

export default function Layout() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-slate-900/50">
        <TopNavbar />

        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <ContentView activePage={activePage} />
        </div>
      </main>
    </div>
  );
}