"use client";

export default function TopNavbar() {
  return (
    <header className="flex items-center justify-between bg-white rounded-xl shadow-lg p-5 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          SmartOps AI Dashboard
        </h1>

        <p className="text-gray-500">
          Inventory & Business Management System
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
          + New Sale
        </button>

        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}