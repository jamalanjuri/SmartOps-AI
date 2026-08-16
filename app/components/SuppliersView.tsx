"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Truck,
  Plus,
  Search,
  RefreshCw,
  X,
  Loader2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";
import {
  supplierService,
  type Supplier,
} from "@/app/services/supplier.service";

export default function SuppliersView() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Supplier Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      setLoading(true);
      setError(null);
      const data = await supplierService.getSuppliers();
      setSuppliers(data);
    } catch (err: any) {
      console.error("Failed to load suppliers:", err);
      setError(err?.message || "Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || isSaving) return;

    setIsSaving(true);
    try {
      await supplierService.createSupplier({
        companyName: companyName.trim(),
        contactPerson: contactPerson.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        paymentTerms,
      });

      setShowAddModal(false);
      setCompanyName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setAddress("");
      setPaymentTerms("Net 30");
      await loadSuppliers();
    } catch (err: any) {
      console.error("Failed to create supplier:", err);
      alert(err?.message || "Failed to register supplier.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this supplier?"
    );
    if (!confirmed) return;

    try {
      await supplierService.deleteSupplier(id);
      await loadSuppliers();
    } catch (err: any) {
      console.error("Failed to delete supplier:", err);
      alert(err?.message || "Failed to deactivate supplier.");
    }
  };

  const filteredSuppliers = useMemo(() => {
    const keyword = searchQuery.toLowerCase().trim();
    if (!keyword) return suppliers;

    return suppliers.filter(
      (s) =>
        s.companyName.toLowerCase().includes(keyword) ||
        (s.contactPerson || "").toLowerCase().includes(keyword) ||
        (s.email || "").toLowerCase().includes(keyword) ||
        (s.phone || "").toLowerCase().includes(keyword)
    );
  }, [suppliers, searchQuery]);

  return (
    <div className="space-y-8 p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Supplier Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage vendor profiles, contact details, and procurement terms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadSuppliers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Supplier
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Directory Search */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Active Vendors</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filteredSuppliers.length} supplier profile(s) stored in database
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company, contact, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Company Name</th>
                <th className="py-3.5 px-4 font-semibold">Contact Person</th>
                <th className="py-3.5 px-4 font-semibold">Email & Phone</th>
                <th className="py-3.5 px-4 font-semibold">Address</th>
                <th className="py-3.5 px-4 text-center font-semibold">Payment Terms</th>
                <th className="py-3.5 px-6 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                      <span>Loading vendors from Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No suppliers found in directory.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-indigo-500" />
                      <span>{supplier.companyName}</span>
                    </td>

                    <td className="py-4 px-4 font-medium">
                      {supplier.contactPerson || "N/A"}
                    </td>

                    <td className="py-4 px-4 text-xs space-y-0.5 font-mono">
                      {supplier.email && (
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span>{supplier.email}</span>
                        </div>
                      )}
                      {supplier.phone && (
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{supplier.phone}</span>
                        </div>
                      )}
                      {!supplier.email && !supplier.phone && "-"}
                    </td>

                    <td className="py-4 px-4 text-xs">
                      {supplier.address ? (
                        <div className="flex items-center gap-1 text-slate-500">
                          <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="truncate max-w-xs">{supplier.address}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold">
                        {supplier.paymentTerms}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 transition"
                        title="Delete Supplier"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold">Add Supplier</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brookside Dairy Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mercy Mwende"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="sales@vendor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Immediate">Immediate / Cash on Delivery</option>
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Industrial Area, Nairobi"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !companyName.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Register Supplier</span>
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