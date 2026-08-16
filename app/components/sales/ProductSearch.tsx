"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Loader2,
  Package,
  RefreshCw,
  Search,
  ShoppingCart,
} from "lucide-react";

import productService, {
  type Product,
} from "@/app/services/productService";

export type SalesProduct = {
  id: string;
  sku: string;
  name: string;
  barcode: string;
  category: string;
  price: number;
  stock: number;
};

type ProductSearchProps = {
  addToCart: (
    product: SalesProduct
  ) => void;
};

export default function ProductSearch({
  addToCart,
}: ProductSearchProps) {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /**
   * Load live products from Supabase.
   */
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await productService.getProducts();

      setProducts(data);
    } catch (error) {
      console.error(
        "Failed to load sales products:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load products when Sales opens.
   */
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Search live inventory.
   */
  const filteredProducts = useMemo(() => {
    const keyword =
      search.toLowerCase().trim();

    if (!keyword) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(keyword) ||
        product.sku
          .toLowerCase()
          .includes(keyword) ||
        product.barcode
          .toLowerCase()
          .includes(keyword) ||
        product.category
          .toLowerCase()
          .includes(keyword)
    );
  }, [products, search]);

  /**
   * Convert an inventory Product into
   * the smaller product object needed
   * by the Sales cart.
   */
  const handleAddToCart = (
    product: Product
  ) => {
    if (product.stock <= 0) {
      return;
    }

    addToCart({
      id: product.id,
      sku: product.sku,
      name: product.name,
      barcode: product.barcode,
      category: product.category,
      price: product.sellingPrice,
      stock: product.stock,
    });
  };

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Product Search
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live products from SmartOps inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={loadProducts}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh Products
        </button>

      </div>

      {/* Search */}

      <div className="relative mb-8">

        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          placeholder="Search by product name, SKU, barcode or category..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />

      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">
              Unable to load products
            </p>

            <p className="mt-1">
              {error}
            </p>
          </div>

        </div>
      )}

      {/* Loading */}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16 text-slate-500">

          <Loader2 className="h-6 w-6 animate-spin" />

          <span>
            Loading inventory...
          </span>

        </div>
      )}

      {/* Products */}

      {!loading &&
        !error &&
        filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

            {filteredProducts.map(
              (product) => {
                const outOfStock =
                  product.stock <= 0;

                const lowStock =
                  product.stock > 0 &&
                  product.stock <=
                    product.minimumStock;

                return (
                  <div
                    key={product.id}
                    className="flex flex-col rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:shadow-md"
                  >

                    {/* Product Icon */}

                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Package className="h-6 w-6" />
                    </div>

                    {/* Product */}

                    <div className="flex-1">

                      <h3 className="font-semibold text-slate-900">
                        {product.name}
                      </h3>

                      <p className="mt-1 font-mono text-xs text-slate-400">
                        {product.sku}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        {product.category ||
                          "Uncategorized"}
                      </p>

                      {product.barcode && (
                        <p className="mt-1 font-mono text-xs text-slate-400">
                          {product.barcode}
                        </p>
                      )}

                      {/* Price */}

                      <p className="mt-4 text-xl font-bold text-slate-900">
                        KSh{" "}
                        {product.sellingPrice.toLocaleString()}
                      </p>

                      {/* Stock */}

                      <div className="mt-2">

                        {outOfStock ? (
                          <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                            Out of Stock
                          </span>
                        ) : lowStock ? (
                          <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Low Stock:{" "}
                            {product.stock}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-500">
                            Stock:{" "}
                            <span className="font-semibold text-slate-700">
                              {product.stock}
                            </span>
                          </span>
                        )}

                      </div>

                    </div>

                    {/* Add */}

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(
                          product
                        )
                      }
                      disabled={outOfStock}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <ShoppingCart className="h-4 w-4" />

                      {outOfStock
                        ? "Unavailable"
                        : "Add to Cart"}
                    </button>

                  </div>
                );
              }
            )}

          </div>
        )}

      {/* Empty */}

      {!loading &&
        !error &&
        filteredProducts.length === 0 && (
          <div className="py-16 text-center">

            <Package className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-700">
              No products found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search or add products through Inventory.
            </p>

          </div>
        )}

    </div>
  );
}