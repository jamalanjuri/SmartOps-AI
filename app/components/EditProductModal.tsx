"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  PackageCheck,
  Pencil,
  X,
} from "lucide-react";

import productService, {
  Product,
} from "@/app/services/productService";

type Props = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: () => void | Promise<void>;
};

interface ProductForm {
  name: string;
  sku: string;
  barcode: string;
  description: string;
  category: string;
  costPrice: string;
  sellingPrice: string;
  stock: string;
  minimumStock: string;
  unit: string;
}

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  barcode: "",
  description: "",
  category: "Dairy",
  costPrice: "",
  sellingPrice: "",
  stock: "",
  minimumStock: "",
  unit: "Piece",
};

export default function EditProductModal({
  open,
  product,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] =
    useState<ProductForm>(emptyForm);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Populate the form whenever
   * a product is selected for editing.
   */
  useEffect(() => {
    if (!product) {
      setForm(emptyForm);
      return;
    }

    setForm({
      name: product.name ?? "",
      sku: product.sku ?? "",
      barcode: product.barcode ?? "",
      description: product.description ?? "",
      category: product.category || "Dairy",
      costPrice: String(product.costPrice ?? ""),
      sellingPrice: String(product.sellingPrice ?? ""),
      stock: String(product.stock ?? ""),
      minimumStock: String(
        product.minimumStock ?? ""
      ),
      unit: product.unit || "Piece",
    });

    setError(null);
  }, [product, open]);

  if (!open || !product) {
    return null;
  }

  const updateField = (
    field: keyof ProductForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) {
      setError(null);
    }
  };

  const handleClose = () => {
    if (saving) {
      return;
    }

    setError(null);
    onClose();
  };

  const handleSave = async () => {
    /*
     * Validate required text fields.
     */
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.sku.trim()) {
      setError("SKU is required.");
      return;
    }

    /*
     * Convert numeric values.
     */
    const costPrice =
      Number(form.costPrice);

    const sellingPrice =
      Number(form.sellingPrice);

    const stock =
      Number(form.stock);

    const minimumStock =
      Number(form.minimumStock);

    /*
     * Validate cost price.
     */
    if (
      form.costPrice === "" ||
      Number.isNaN(costPrice) ||
      costPrice < 0
    ) {
      setError(
        "Enter a valid cost price."
      );
      return;
    }

    /*
     * Validate selling price.
     */
    if (
      form.sellingPrice === "" ||
      Number.isNaN(sellingPrice) ||
      sellingPrice < 0
    ) {
      setError(
        "Enter a valid selling price."
      );
      return;
    }

    /*
     * Validate stock.
     */
    if (
      form.stock === "" ||
      Number.isNaN(stock) ||
      stock < 0
    ) {
      setError(
        "Enter a valid current stock quantity."
      );
      return;
    }

    /*
     * Validate minimum stock.
     */
    if (
      form.minimumStock === "" ||
      Number.isNaN(minimumStock) ||
      minimumStock < 0
    ) {
      setError(
        "Enter a valid minimum stock quantity."
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      /*
       * Update the selected product
       * in Supabase.
       */
      await productService.updateProduct(
        product.id,
        {
          sku: form.sku.trim(),
          barcode: form.barcode.trim(),
          name: form.name.trim(),
          description:
            form.description.trim(),
          category: form.category,
          costPrice,
          sellingPrice,
          stock,
          minimumStock,
          unit: form.unit,
          isActive: product.isActive,
        }
      );

      /*
       * Reload InventoryView after
       * successful database update.
       */
      await onSave();

      /*
       * Close modal after successful save.
       */
      onClose();
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* ===========================
            Header
        ============================ */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Pencil className="h-5 w-5" />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Edit Product
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update product information and inventory levels.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close edit product modal"
          >
            <X className="h-6 w-6" />
          </button>

        </div>

        {/* ===========================
            Product Form
        ============================ */}

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

          {/* Product Name */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product Name
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                updateField(
                  "name",
                  event.target.value
                )
              }
              placeholder="Milk 500ml"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />

          </div>

          {/* SKU */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              SKU
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="text"
              value={form.sku}
              onChange={(event) =>
                updateField(
                  "sku",
                  event.target.value
                )
              }
              placeholder="MILK-001"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />

          </div>

          {/* Barcode */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Barcode
            </label>

            <input
              type="text"
              value={form.barcode}
              onChange={(event) =>
                updateField(
                  "barcode",
                  event.target.value
                )
              }
              placeholder="200000000001"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />

          </div>

          {/* Category */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              value={form.category}
              onChange={(event) =>
                updateField(
                  "category",
                  event.target.value
                )
              }
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            >

              <option value="Dairy">
                Dairy
              </option>

              <option value="Bakery">
                Bakery
              </option>

              <option value="Groceries">
                Groceries
              </option>

              <option value="Beverages">
                Beverages
              </option>

              <option value="Snacks">
                Snacks
              </option>

              <option value="Household">
                Household
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* Description */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              placeholder="Optional product description"
              rows={3}
              disabled={saving}
              className="w-full resize-none rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />

          </div>

          {/* Cost Price */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Cost Price
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.costPrice}
              onChange={(event) =>
                updateField(
                  "costPrice",
                  event.target.value
                )
              }
              placeholder="80"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />

          </div>

          {/* Selling Price */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Selling Price
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.sellingPrice}
              onChange={(event) =>
                updateField(
                  "sellingPrice",
                  event.target.value
                )
              }
              placeholder="120"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />

          </div>

          {/* Current Stock */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Current Stock
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(event) =>
                updateField(
                  "stock",
                  event.target.value
                )
              }
              placeholder="50"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />

          </div>

          {/* Minimum Stock */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Minimum Stock
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={form.minimumStock}
              onChange={(event) =>
                updateField(
                  "minimumStock",
                  event.target.value
                )
              }
              placeholder="10"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />

          </div>

          {/* Unit */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Unit
            </label>

            <select
              value={form.unit}
              onChange={(event) =>
                updateField(
                  "unit",
                  event.target.value
                )
              }
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            >

              <option value="Piece">
                Piece
              </option>

              <option value="Bottle">
                Bottle
              </option>

              <option value="Packet">
                Packet
              </option>

              <option value="Box">
                Box
              </option>

              <option value="Kg">
                Kg
              </option>

              <option value="Litre">
                Litre
              </option>

            </select>

          </div>

          {/* Product ID */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product ID
            </label>

            <input
              type="text"
              value={product.id}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 p-3 text-slate-500"
            />

          </div>

        </div>

        {/* ===========================
            Error Message
        ============================ */}

        {error && (
          <div className="mx-6 mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            <span className="font-semibold">
              Unable to update product:
            </span>{" "}

            {error}

          </div>
        )}

        {/* ===========================
            Footer
        ============================ */}

        <div className="sticky bottom-0 flex justify-end gap-4 border-t bg-white p-6">

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <PackageCheck className="h-5 w-5" />
                Save Changes
              </>
            )}

          </button>

        </div>

      </div>
    </div>
  );
}