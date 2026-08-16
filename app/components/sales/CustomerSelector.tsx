"use client";

import { useEffect, useState } from "react";
import { customerService, Customer } from "@/app/services/customer.service";
import { UserPlus, X, Search, Check, Loader2 } from "lucide-react";

type SelectedCustomer = {
  id?: string;
  name: string;
  phone?: string;
  type?: string;
};

interface CustomerSelectorProps {
  selectedCustomer: SelectedCustomer;
  onCustomerSelect: (customer: SelectedCustomer) => void;
}

export default function CustomerSelector({
  selectedCustomer,
  onCustomerSelect,
}: CustomerSelectorProps) {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // New Customer Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullName: "",
    phone: "",
    email: "",
    customerType: "Standard",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);

      // If no customer has been selected yet, default to the first customer
      if (!selectedCustomer.id && data.length > 0) {
        onCustomerSelect({
          id: data[0].id,
          name: data[0].full_name,
          phone: data[0].phone,
          type: data[0].customer_type,
        });
      }
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!newCustomer.fullName.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const created = await customerService.createCustomer({
        full_name: newCustomer.fullName.trim(),
        phone: newCustomer.phone.trim() || undefined,
        email: newCustomer.email.trim() || undefined,
        customer_type: newCustomer.customerType,
        loyalty_points: 0,
      });

      // Update local list
      setCustomers((prev) => [created, ...prev]);

      // Automatically select the newly created customer
      onCustomerSelect({
        id: created.id,
        name: created.full_name,
        phone: created.phone,
        type: created.customer_type,
      });

      // Reset modal state
      setNewCustomer({
        fullName: "",
        phone: "",
        email: "",
        customerType: "Standard",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create customer:", error);
      alert("Failed to create customer. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (customer.phone ?? "").includes(search)
  );

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Customer Selection
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Assign sale to an existing account or register a new customer
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium text-sm flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search customer by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-100 text-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading customers from Supabase...</span>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
              No matching customers found.
            </div>
          ) : (
            filteredCustomers.map((customer) => {
              const isSelected = selectedCustomer.id === customer.id;
              return (
                <div
                  key={customer.id}
                  onClick={() =>
                    onCustomerSelect({
                      id: customer.id,
                      name: customer.full_name,
                      phone: customer.phone,
                      type: customer.customer_type,
                    })
                  }
                  className={`border rounded-xl p-4 cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-500"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {isSelected ? <Check className="h-4 w-4" /> : customer.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        {customer.full_name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {customer.phone || "No phone registered"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {customer.loyalty_points !== undefined && (
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        {customer.loyalty_points} pts
                      </span>
                    )}
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                      {customer.customer_type || "Standard"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* On-The-Fly New Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Register New Customer
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mercy Mwende"
                  value={newCustomer.fullName}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, fullName: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +254 700 000 000"
                  value={newCustomer.phone}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, phone: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. mercy@example.com"
                  value={newCustomer.email}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, email: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Customer Classification
                </label>
                <select
                  value={newCustomer.customerType}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, customerType: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Standard">Standard Tier</option>
                  <option value="VIP">VIP Tier</option>
                  <option value="Corporate">Corporate Account</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !newCustomer.fullName.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save & Select Customer</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}