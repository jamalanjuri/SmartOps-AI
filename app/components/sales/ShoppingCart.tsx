"use client";

import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export type CartItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type ShoppingCartProps = {
  cart: CartItem[];
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  openPayment: () => void;
};

export default function ShoppingCart({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  openPayment,
}: ShoppingCartProps) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  return (
    <div className="mt-8 rounded-2xl bg-white p-6 lg:p-8 shadow-xl border border-slate-200 text-slate-900">
      {/* Header & Customer Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Shopping Cart
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Review order items before payment
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 px-4 py-2 border border-slate-200">
          <p className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
            Customer
          </p>
          <p className="text-sm font-bold text-slate-800">
            Walk-in Customer
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 py-16 px-6 text-center bg-slate-50/50">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
            <ShoppingBag size={32} />
          </div>

          <h3 className="text-xl font-bold text-slate-800">
            Your cart is currently empty
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Search or pick products from the inventory list to begin checkout.
          </p>
        </div>
      ) : (
        <>
          {/* Item List */}
          <div className="space-y-3.5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {item.name}
                  </h3>

                  <p className="text-xs font-medium text-slate-500 mt-1">
                    Unit Price:{" "}
                    <span className="font-semibold text-slate-700">
                      KSh {item.price.toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  {/* Quantity Controller */}
                  <div className="flex items-center rounded-xl bg-white border border-slate-200 p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-10 text-center font-mono font-bold text-slate-900 text-sm">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="min-w-[110px] text-right font-mono font-bold text-slate-900 text-base">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition shadow-sm"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="mt-8 rounded-2xl bg-slate-50 p-6 border border-slate-200 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span className="font-medium">Subtotal</span>
              <span className="font-mono font-semibold text-slate-900">
                KSh {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-sm text-slate-600">
              <span className="font-medium">VAT (16%)</span>
              <span className="font-mono font-semibold text-slate-900">
                KSh {vat.toFixed(0)}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
              <span className="text-lg font-bold text-slate-900">Total Payable</span>
              <span className="text-2xl font-black font-mono text-blue-600">
                KSh {total.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={clearCart}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition shadow-sm"
            >
              Clear Cart
            </button>

            <button
              type="button"
              onClick={openPayment}
              disabled={cart.length === 0}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-7 py-3 text-sm font-bold text-white transition shadow-lg shadow-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Proceed to Payment</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}