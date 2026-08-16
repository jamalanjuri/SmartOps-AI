"use client";

import { useMemo, useState } from "react";

import CustomerSelector from "./sales/CustomerSelector";
import ShoppingCart from "./sales/ShoppingCart";
import ProductSearch from "./sales/ProductSearch";
import PaymentModal from "./sales/PaymentModal";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type SelectedCustomer = {
  id?: string;
  name: string;
  phone?: string;
  type?: string;
};

type ProductForCart = {
  id: string;
  name: string;
  price: number;
};

const VAT_RATE = 0.16;

export default function SalesView() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Selected customer from CustomerSelector
  const [selectedCustomer, setSelectedCustomer] = useState<SelectedCustomer>({
    name: "Walk-in Customer",
  });

  /**
   * Financial calculations
   */
  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);

  const vat = useMemo(() => {
    return subtotal * VAT_RATE;
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + vat;
  }, [subtotal, vat]);

  /**
   * Add a Supabase inventory product to the current sale.
   */
  function addToCart(product: ProductForCart) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  }

  /**
   * Increase cart quantity.
   */
  function increaseQuantity(id: string) {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  /**
   * Decrease cart quantity.
   * Remove item when quantity reaches zero.
   */
  function decreaseQuantity(id: string) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  /**
   * Remove product from cart.
   */
  function removeFromCart(id: string) {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  /**
   * Empty the entire cart.
   */
  function clearCart() {
    setCart([]);
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-slate-900">Sales</h1>

      <p className="mt-2 text-gray-500">
        Manage daily sales, invoices and customer transactions.
      </p>

      <div className="mt-10">
        <CustomerSelector
          selectedCustomer={selectedCustomer}
          onCustomerSelect={setSelectedCustomer}
        />
      </div>

      <ShoppingCart
        cart={cart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        openPayment={() => setPaymentOpen(true)}
      />

      <ProductSearch addToCart={addToCart} />

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        total={total}
        cart={cart}
        customer={selectedCustomer}
        onSaleComplete={() => {
          clearCart();
          setPaymentOpen(false);
        }}
      />
    </>
  );
}