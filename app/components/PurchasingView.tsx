"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  CircleDollarSign,
  Plus,
  Search,
  RefreshCw,
  X,
  Loader2,
  PackageCheck,
  Eye,
  Building2,
} from "lucide-react";

import {
  purchaseService,
  type Purchase,
  type PurchaseStatus,
} from "@/app/services/purchase.service";
import productService, { type Product } from "@/app/services/productService";
import {
  supplierService,
  type Supplier,
} from "@/app/services/supplier.service";

export default function PurchasingView() {
  const [purchaseOrders, setPurchaseOrders] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Purchase Order Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSupplierName, setSelectedSupplierName] = useState("");
  const [notes, setNotes] = useState("");
  const [orderItems, setOrderItems] = useState<
    { productId: string; productName: string; unitCost: number; quantityOrdered: number }[]
  >([]);

  // Line item selection state
  const [selectedProductId, setSelectedProductId] = useState("");
  const [itemQuantity, setItemQuantity] = useState(10);
  const [itemUnitCost, setItemUnitCost] = useState(0);

  // Receiving PO State
  const [receivingId, setReceivingId] = useState<string | null>(null);

  // PO Details Modal State
  const [viewingPO, setViewingPO] = useState<Purchase | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [pos, catalog, vendorList] = await Promise.all([
        purchaseService.getPurchases(),
        productService.getProducts(),
        supplierService.getSuppliers(),
      ]);
      setPurchaseOrders(pos);
      setProducts(catalog);
      setSuppliers(vendorList);
    } catch (err: any) {
      console.error("Failed to load purchasing data:", err);
      setError(err?.message || "Failed to load purchase orders.");
    } finally {
      setLoading(false);
    }
  }

  const handleSelectProductForLineItem = (productId: string) => {
    setSelectedProductId(productId);
    const found = products.find((p) => p.id === productId);
    if (found) {
      setItemUnitCost(found.costPrice);
    }
  };

  const handleAddLineItem = () => {
    if (!selectedProductId || itemQuantity <= 0) return;
    const found = products.find((p) => p.id === selectedProductId);
    if (!found) return;

    if (orderItems.some((item) => item.productId === selectedProductId)) {
      alert("Product is already added to this purchase order.");
      return;
    }

    setOrderItems((prev) => [
      ...prev,
      {
        productId: found.id,
        productName: found.name,
        unitCost: itemUnitCost,
        quantityOrdered: itemQuantity,
      },
    ]);

    setSelectedProductId("");
    setItemQuantity(10);
    setItemUnitCost(0);
  };

  const handleRemoveLineItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePurchaseOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierName || orderItems.length === 0 || isSaving) return;

    setIsSaving(true);
    try {
      await purchaseService.createPurchase({
        supplierName: selectedSupplierName,
        notes: notes.trim() || undefined,
        items: orderItems,
      });

      setShowCreateModal(false);
      setSelectedSupplierName("");
      setNotes("");
      setOrderItems([]);
      await loadData();
    } catch (err: any) {
      console.error("Failed to create purchase order:", err);
      alert(err?.message || "Failed to create purchase order.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReceiveOrder = async (poId: string) => {
    const confirmed = window.confirm(
      "Mark this Purchase Order as received? This will automatically add the ordered quantities into your live inventory stock."
    );
    if (!confirmed) return;

    setReceivingId(poId);
    try {
      await purchaseService.receivePurchase(poId);
      await loadData();
    } catch (err: any) {
      console.error("Failed to receive purchase order:", err);
      alert(err?.message || "Failed to mark order as received.");
    } finally {
      setReceivingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const keyword = searchQuery.toLowerCase().trim();
    if (!keyword) return purchaseOrders;

    return purchaseOrders.filter((order) => {
      const itemsText = (order.items || [])
        .map((i) => i.productName)
        .join(" ")
        .toLowerCase();

      return (
        order.poNumber.toLowerCase().includes(keyword) ||
        order.supplierName.toLowerCase().includes(keyword) ||
        itemsText.includes(keyword) ||
        order.status.toLowerCase().includes(keyword)
      );
    });
  }, [purchaseOrders, searchQuery]);

  const totalOrdersCount = filteredOrders.length;

  const pendingOrdersCount = useMemo(() => {
    return filteredOrders.filter(
      (order) => order.status === "ordered" || order.status === "draft"
    ).length;
  }, [filteredOrders]);

  const receivedOrdersCount = useMemo(() => {
    return filteredOrders.filter((order) => order.status === "received").length;
  }, [filteredOrders]);

  const grandPurchaseValue = useMemo(() => {
    return filteredOrders.reduce((total, order) => total + order.totalAmount, 0);
  }, [filteredOrders]);

  const getStatusBadgeStyle = (status: PurchaseStatus) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      case "ordered":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "received":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 p-6 bg-slate-50/50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Purchasing Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor suppliers, purchase orders, and incoming stock shipments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            New Purchase Order
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Analytics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Purchase Orders
            </p>
            <span className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2.5 text-slate-600 dark:text-slate-300">
              <ClipboardList className="h-5 w-5" />
            </span>
          </div>
          <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono">
            {totalOrdersCount}
          </h3>
          <p className="mt-1 text-xs text-slate-400">Cataloged procurement records</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Deliveries
            </p>
            <span className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
              <Clock3 className="h-5 w-5" />
            </span>
          </div>
          <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono text-amber-600 dark:text-amber-400">
            {pendingOrdersCount}
          </h3>
          <p className="mt-1 text-xs text-slate-400">Awaiting supplier shipment</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Received Orders
            </p>
            <span className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
          <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono text-emerald-600 dark:text-emerald-400">
            {receivedOrdersCount}
          </h3>
          <p className="mt-1 text-xs text-slate-400">Fulfilled & inventory restocked</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Procurement Expenditure
            </p>
            <span className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
              <CircleDollarSign className="h-5 w-5" />
            </span>
          </div>
          <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-slate-100">
            KES {grandPurchaseValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </h3>
          <p className="mt-1 text-xs text-slate-400">Cumulative total with 16% VAT</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Purchase Orders</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live records persisted in Supabase database.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search PO #, supplier or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6 font-semibold">PO Number</th>
                <th className="py-3.5 px-4 font-semibold">Supplier</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Created Date</th>
                <th className="py-3.5 px-4 text-center font-semibold">Status</th>
                <th className="py-3.5 px-4 text-right font-semibold">Total</th>
                <th className="py-3.5 px-6 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                      <span>Loading purchase orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No purchase orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusBadgeStyle = getStatusBadgeStyle(order.status);
                  const isReceivingThis = receivingId === order.id;

                  const lineItemsSummary = (order.items || [])
                    .map((i) => `${i.productName} (x${i.quantityOrdered})`)
                    .join(", ");

                  const totalUnits = (order.items || []).reduce(
                    (sum, i) => sum + i.quantityOrdered,
                    0
                  );

                  return (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-4 px-6 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {order.poNumber}
                      </td>

                      <td className="py-4 px-4 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{order.supplierName}</span>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div
                          className="truncate text-slate-800 dark:text-slate-200 font-medium text-xs"
                          title={lineItemsSummary}
                        >
                          {lineItemsSummary || "No items listed"}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {totalUnits} unit(s) total
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "-"}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${statusBadgeStyle}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                        KES {order.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => setViewingPO(order)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {order.status !== "received" && (
                            <button
                              type="button"
                              disabled={isReceivingThis}
                              onClick={() => handleReceiveOrder(order.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-bold text-xs flex items-center gap-1 transition"
                            >
                              {isReceivingThis ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <PackageCheck className="h-3.5 w-3.5" />
                              )}
                              <span>Receive Stock</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Order Modal with Dynamic Supplier Select */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold">Create Purchase Order</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePurchaseOrder} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Select Supplier Vendor <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={selectedSupplierName}
                  onChange={(e) => setSelectedSupplierName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Select Active Vendor --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.companyName}>
                      {s.companyName} ({s.paymentTerms})
                    </option>
                  ))}
                </select>
                {suppliers.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    No active suppliers found. Please register a vendor in the Suppliers tab first.
                  </p>
                )}
              </div>

              {/* Line Items Selection */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-500">Add Line Item</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Product</label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => handleSelectProductForLineItem(e.target.value)}
                      className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-800 focus:outline-none"
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Stock: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unit Cost (KES)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemUnitCost}
                      onChange={(e) => setItemUnitCost(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Order Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(parseInt(e.target.value, 10) || 1)}
                      className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono bg-white dark:bg-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddLineItem}
                  disabled={!selectedProductId || itemQuantity <= 0}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                >
                  + Add Item to Order
                </button>
              </div>

              {/* Line Items Preview */}
              {orderItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500">PO Line Items</h4>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500">
                        <tr>
                          <th className="p-2 text-left">Product</th>
                          <th className="p-2 text-center">Qty</th>
                          <th className="p-2 text-right">Unit Cost</th>
                          <th className="p-2 text-right">Line Total</th>
                          <th className="p-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {orderItems.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-medium">{item.productName}</td>
                            <td className="p-2 text-center font-mono">{item.quantityOrdered}</td>
                            <td className="p-2 text-right font-mono">KES {item.unitCost.toFixed(2)}</td>
                            <td className="p-2 text-right font-mono font-bold">
                              KES {(item.unitCost * item.quantityOrdered).toFixed(2)}
                            </td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveLineItem(idx)}
                                className="text-rose-500 hover:text-rose-700 font-bold"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Procurement Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Delivery scheduled for Friday morning"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || orderItems.length === 0 || !selectedSupplierName}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Creating PO...</span>
                    </>
                  ) : (
                    <span>Submit Purchase Order</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PO View Modal */}
      {viewingPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {viewingPO.poNumber}
                </h3>
                <p className="text-xs text-slate-500">Supplier: {viewingPO.supplierName}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingPO(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <p><strong>Status:</strong> <span className="uppercase font-bold">{viewingPO.status}</span></p>
                <p><strong>Created:</strong> {viewingPO.createdAt ? new Date(viewingPO.createdAt).toLocaleString() : "-"}</p>
                {viewingPO.notes && <p><strong>Notes:</strong> {viewingPO.notes}</p>}
              </div>

              <div>
                <h4 className="font-bold uppercase text-slate-500 mb-2">Order Line Items</h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500">
                      <tr>
                        <th className="p-2 text-left">Product</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Unit Cost</th>
                        <th className="p-2 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {(viewingPO.items || []).map((item, i) => (
                        <tr key={i}>
                          <td className="p-2 font-medium">{item.productName}</td>
                          <td className="p-2 text-center font-mono">{item.quantityOrdered}</td>
                          <td className="p-2 text-right font-mono">KES {item.unitCost.toFixed(2)}</td>
                          <td className="p-2 text-right font-mono font-bold">KES {item.lineTotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1 font-mono text-right">
                <p>Subtotal: KES {viewingPO.subtotal.toFixed(2)}</p>
                <p>VAT (16%): KES {viewingPO.taxAmount.toFixed(2)}</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  Total: KES {viewingPO.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewingPO(null)}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}