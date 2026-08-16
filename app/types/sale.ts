/**
 * SmartOps AI
 * Enterprise Sale Model
 * Version 1.1
 *
 * Product identifiers use strings because
 * SmartOps inventory products use Supabase UUIDs.
 */

export type PaymentMethod =
  | "cash"
  | "mpesa"
  | "visa"
  | "mastercard"
  | "debit_card"
  | "credit_card"
  | "bank_transfer"
  | "split"
  | "store_credit"
  | "qr_payment"
  | "digital_wallet";

export type SaleStatus =
  | "draft"
  | "pending"
  | "completed"
  | "cancelled"
  | "refunded";

/**
 * Individual product sold in a transaction.
 *
 * id and productId are strings because
 * inventory products use Supabase UUIDs.
 */
export interface SaleItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Financial totals for a sale.
 */
export interface SaleTotals {
  subtotal: number;
  vat: number;
  discount: number;
  total: number;
}

/**
 * Payment information attached to a sale.
 */
export interface PaymentDetails {
  method: PaymentMethod;
  amountReceived: number;
  change: number;
}

/**
 * Lightweight customer information stored
 * with a completed sale.
 */
export interface CustomerSummary {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  customerType?: string;
  loyaltyPoints?: number;
}

/**
 * Payload interface for creating/completing a sale transaction.
 */
export interface CreateSaleInput {
  customerId?: string;
  customerName?: string;
  customer?: CustomerSummary;
  cashier: string;
  items: SaleItem[];
  paymentMethod: PaymentMethod;
  amountReceived: number;
  notes?: string;
}

/**
 * Complete SmartOps sale transaction.
 */
export interface Sale {
  id: string;

  receiptNumber: string;

  customer: CustomerSummary;

  cashier: string;

  items: SaleItem[];

  totals: SaleTotals;

  payment: PaymentDetails;

  status: SaleStatus;

  notes?: string;

  createdAt: Date;

  updatedAt: Date;
}