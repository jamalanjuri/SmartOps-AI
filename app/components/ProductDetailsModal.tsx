"use client";

import {
  Barcode,
  Boxes,
  CircleDollarSign,
  Hash,
  Package,
  Tag,
  X,
} from "lucide-react";

import type {
  Product,
} from "@/app/services/productService";

type Props = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
};

export default function ProductDetailsModal({
  open,
  product,
  onClose,
}: Props) {
  if (!open || !product) {
    return null;
  }

  const getStockStatus = () => {
    if (product.stock === 0) {
      return {
        label: "Out of Stock",
        className:
          "border-red-200 bg-red-50 text-red-700",
      };
    }

    if (
      product.stock <=
      product.minimumStock
    ) {
      return {
        label: "Low Stock",
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
      };
    }

    return {
      label: "In Stock",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  };

  const status = getStockStatus();

  const inventoryValue =
    product.stock * product.costPrice;

  const potentialSalesValue =
    product.stock * product.sellingPrice;

  const potentialProfit =
    potentialSalesValue - inventoryValue;

  const createdDate =
    product.createdAt
      ? new Date(
          product.createdAt
        ).toLocaleString()
      : "Not available";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Product Details
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {product.name}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>

                <span className="text-xs text-slate-400">
                  {product.isActive
                    ? "Active Product"
                    : "Inactive Product"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close product details"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Main Product Information */}

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* SKU */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Hash className="h-4 w-4" />

                <span className="text-xs font-semibold uppercase tracking-wider">
                  SKU
                </span>
              </div>

              <p className="mt-2 font-mono text-sm font-semibold text-slate-900">
                {product.sku}
              </p>
            </div>

            {/* Barcode */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Barcode className="h-4 w-4" />

                <span className="text-xs font-semibold uppercase tracking-wider">
                  Barcode
                </span>
              </div>

              <p className="mt-2 font-mono text-sm font-semibold text-slate-900">
                {product.barcode ||
                  "No barcode"}
              </p>
            </div>

            {/* Category */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Tag className="h-4 w-4" />

                <span className="text-xs font-semibold uppercase tracking-wider">
                  Category
                </span>
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {product.category ||
                  "Uncategorized"}
              </p>
            </div>

            {/* Stock */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Boxes className="h-4 w-4" />

                <span className="text-xs font-semibold uppercase tracking-wider">
                  Current Stock
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {product.stock}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {product.unit}
              </p>
            </div>

            {/* Minimum Stock */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Boxes className="h-4 w-4" />

                <span className="text-xs font-semibold uppercase tracking-wider">
                  Minimum Stock
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {product.minimumStock}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Reorder threshold
              </p>
            </div>

            {/* Unit */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Package className="h-4 w-4" />

                <span className="text-xs font-semibold uppercase tracking-wider">
                  Unit
                </span>
              </div>

              <p className="mt-2 text-lg font-bold text-slate-900">
                {product.unit ||
                  "Not specified"}
              </p>
            </div>
          </div>

          {/* Pricing */}

          <div className="mt-6">
            <h3 className="text-base font-bold text-slate-900">
              Pricing & Valuation
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Current inventory value and
              potential sales performance.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Cost Price */}

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Cost Price
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  KSh{" "}
                  {product.costPrice.toLocaleString()}
                </p>
              </div>

              {/* Selling Price */}

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Selling Price
                </p>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  KSh{" "}
                  {product.sellingPrice.toLocaleString()}
                </p>
              </div>

              {/* Inventory Value */}

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CircleDollarSign className="h-4 w-4" />

                  <p className="text-xs font-semibold uppercase tracking-wider">
                    Inventory Value
                  </p>
                </div>

                <p className="mt-2 text-xl font-bold text-emerald-700">
                  KSh{" "}
                  {inventoryValue.toLocaleString()}
                </p>
              </div>

              {/* Potential Profit */}

              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Potential Profit
                </p>

                <p className="mt-2 text-xl font-bold text-indigo-700">
                  KSh{" "}
                  {potentialProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}

          <div className="mt-6 rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Description
            </h3>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {product.description?.trim() ||
                "No product description has been added."}
            </p>
          </div>

          {/* Database Information */}

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Product Information
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Product ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-600">
                  {product.id}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {createdDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="sticky bottom-0 flex justify-end border-t bg-white p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}