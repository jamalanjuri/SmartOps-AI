"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  Package,
  DollarSign,
  AlertTriangle,
  CircleOff,
  Plus,
  Search,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Loader2,
} from "lucide-react";

import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import ProductDetailsModal from "./ProductDetailsModal";

import productService, {
  type Product,
} from "@/app/services/productService";

export default function InventoryView() {
  const [products, setProducts] = useState<Product[]>([]);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Stock Adjustment State
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<string>("");
  const [adjustType, setAdjustType] = useState<"restock" | "loss">("restock");
  const [isAdjusting, setIsAdjusting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load inventory directly from Supabase without race timeouts.
   */
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("[InventoryView] Loading products from productService...");

      const data = await productService.getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("[InventoryView Error] Failed to load inventory:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load inventory from database."
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initInventory() {
      try {
        setLoading(true);
        setError(null);
        console.log("[InventoryView] Mounting component and initializing inventory fetch...");

        const data = await productService.getProducts();

        if (isMounted) {
          setProducts(data || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("[InventoryView Error] Initialization failed:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load inventory."
          );
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initInventory();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Search and filter products.
   */
  const filteredProducts = useMemo(() => {
    const keyword = searchQuery.toLowerCase().trim();

    if (!keyword) return products;

    return products.filter((product) => {
      return (
        (product.name || "").toLowerCase().includes(keyword) ||
        (product.sku || "").toLowerCase().includes(keyword) ||
        (product.category || "").toLowerCase().includes(keyword) ||
        (product.barcode || "").toLowerCase().includes(keyword)
      );
    });
  }, [products, searchQuery]);

  /**
   * Inventory analytics.
   */
  const totalProducts = filteredProducts.length;

  const inventoryValue = useMemo(() => {
    return filteredProducts.reduce(
      (total, product) => total + (product.stock || 0) * (product.costPrice || 0),
      0
    );
  }, [filteredProducts]);

  const lowStockItems = useMemo(() => {
    return filteredProducts.filter(
      (product) => product.stock > 0 && product.stock <= (product.minimumStock || 5)
    );
  }, [filteredProducts]);

  const outOfStockItems = useMemo(() => {
    return filteredProducts.filter((product) => product.stock === 0);
  }, [filteredProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenAddProduct = () => setShowAddProduct(true);
  const handleCloseAddProduct = () => setShowAddProduct(false);

  const handleSaveProduct = async () => {
    setShowAddProduct(false);
    await loadProducts();
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleCloseProductDetails = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditProduct(true);
  };

  const handleCloseEditProduct = () => {
    setShowEditProduct(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = async () => {
    await loadProducts();
  };

  /**
   * Stock Adjustment Modal Handler
   */
  const handleOpenAdjust = (product: Product) => {
    setAdjustingProduct(product);
    setAdjustQuantity("");
    setAdjustType("restock");
    setShowAdjustModal(true);
  };

  const handleExecuteAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct || !adjustQuantity || isAdjusting) return;

    const parsedQty = parseInt(adjustQuantity, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      alert("Please enter a valid positive quantity.");
      return;
    }

    setIsAdjusting(true);
    try {
      const delta = adjustType === "restock" ? parsedQty : -parsedQty;
      await productService.adjustStock(adjustingProduct.id, delta);
      setShowAdjustModal(false);
      setAdjustingProduct(null);
      await loadProducts();
    } catch (err: unknown) {
      console.error("Adjustment failed:", err);
      alert(err instanceof Error ? err.message : "Failed to adjust stock.");
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      setError(null);
      await productService.deleteProduct(productId);
      setProducts((previous) =>
        previous.filter((product) => product.id !== productId)
      );

      if (selectedProduct?.id === productId) {
        setSelectedProduct(null);
        setShowEditProduct(false);
        setShowProductDetails(false);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete product."
      );
    }
  };

  const getStockStatus = (stock: number, minimumStock: number) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        className:
          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      };
    }

    if (stock <= (minimumStock || 5)) {
      return {
        label: "Low Stock",
        className:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    }

    return {
      label: "In Stock",
      className:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    };
  };

  return (
    <div className="min-h-screen space-y-8 bg-slate-50/50 dark:bg-slate-950 p-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor stock levels, track product valuation, and manage catalog operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleOpenAddProduct}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
          <strong>Inventory error:</strong> {error}
        </div>
      )}

      {/* Low Stock Urgent Warning Banner */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Stock Threshold Alert</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold text-amber-600 dark:text-amber-400">{lowStockItems.length} low stock</span> and{" "}
                <span className="font-bold text-rose-600 dark:text-rose-400">{outOfStockItems.length} out-of-stock</span> item(s) require replenishment.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery("low")}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 transition"
          >
            Filter Critical Stock
          </button>
        </div>
      )}

      {/* Analytics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Products
            </p>
            <span className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2.5 text-slate-600 dark:text-slate-300">
              <Package className="h-5 w-5" />
            </span>
          </div>
          <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono">
            {totalProducts}
          </h3>
        </div>

        {/* Inventory Value */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Inventory Value
            </p>
            <span className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </span>
          </div>
          <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono text-emerald-600 dark:text-emerald-400">
            KES {inventoryValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </h3>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Low Stock
            </p>
            <span className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </span>
          </div>
          <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono text-amber-600 dark:text-amber-400">
            {lowStockItems.length}
          </h3>
        </div>

        {/* Out of Stock */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Out of Stock
            </p>
            <span className="rounded-xl bg-rose-500/10 p-2.5 text-rose-600 dark:text-rose-400">
              <CircleOff className="h-5 w-5" />
            </span>
          </div>
          <h3 className="mt-3 text-3xl font-extrabold tracking-tight font-mono text-rose-600 dark:text-rose-400">
            {outOfStockItems.length}
          </h3>
        </div>
      </div>

      {/* Products Directory */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Products Directory</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live inventory from Supabase database.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, barcode, or category..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-4 py-3.5">SKU</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5 text-center">Stock</th>
                <th className="px-4 py-3.5 text-right">Cost Price</th>
                <th className="px-4 py-3.5 text-right">Selling Price</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {loading && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                      <span>Loading inventory...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                filteredProducts.map((product) => {
                  const status = getStockStatus(
                    product.stock || 0,
                    product.minimumStock || 5
                  );

                  return (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {product.name}
                        </div>
                        <div className="font-mono text-xs text-slate-400">
                          {product.barcode || "No barcode"}
                        </div>
                      </td>

                      <td className="px-4 py-4 font-mono text-xs">
                        {product.sku || "N/A"}
                      </td>

                      <td className="px-4 py-4">
                        {product.category || "Uncategorized"}
                      </td>

                      <td className="px-4 py-4 text-center font-semibold font-mono text-slate-900 dark:text-slate-100">
                        {product.stock || 0} {product.unit || "pcs"}
                      </td>

                      <td className="px-4 py-4 text-right font-mono">
                        KES {(product.costPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-4 py-4 text-right font-semibold font-mono text-slate-900 dark:text-slate-100">
                        KES {(product.sellingPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          <button
                            type="button"
                            onClick={() => handleOpenAdjust(product)}
                            className="inline-flex items-center gap-1 transition hover:text-indigo-800 dark:hover:text-indigo-200"
                          >
                            <SlidersHorizontal className="h-3 w-3" />
                            <span>Adjust</span>
                          </button>

                          <span className="text-slate-300 dark:text-slate-700">•</span>

                          <button
                            type="button"
                            onClick={() => handleViewProduct(product)}
                            className="transition hover:text-indigo-800 dark:hover:text-indigo-200"
                          >
                            View
                          </button>

                          <span className="text-slate-300 dark:text-slate-700">•</span>

                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            className="transition hover:text-indigo-800 dark:hover:text-indigo-200"
                          >
                            Edit
                          </button>

                          <span className="text-slate-300 dark:text-slate-700">•</span>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-rose-500 transition hover:text-rose-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No products found in inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold">Stock Adjustment</h3>
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteAdjustment} className="space-y-4 mt-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Product</p>
                <p className="text-sm font-bold mt-0.5">{adjustingProduct.name}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Current Stock: <span className="font-bold">{adjustingProduct.stock || 0} {adjustingProduct.unit || "pcs"}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Adjustment Operation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdjustType("restock")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      adjustType === "restock"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    <span>Restock / Receive</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType("loss")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      adjustType === "loss"
                        ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <ArrowDownRight className="h-4 w-4" />
                    <span>Waste / Loss</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Quantity ({adjustingProduct.unit || "pcs"})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 24"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting || !adjustQuantity}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition flex items-center gap-2"
                >
                  {isAdjusting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Confirm Adjustment</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        open={showAddProduct}
        onClose={handleCloseAddProduct}
        onSave={handleSaveProduct}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        open={showProductDetails}
        product={selectedProduct}
        onClose={handleCloseProductDetails}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        open={showEditProduct}
        product={selectedProduct}
        onClose={handleCloseEditProduct}
        onSave={handleUpdateProduct}
      />
    </div>
  );
}