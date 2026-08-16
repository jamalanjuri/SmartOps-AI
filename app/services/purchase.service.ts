import productService from "./productService";

export type PurchaseStatus = "draft" | "ordered" | "received" | "cancelled" | string;

export interface PurchaseItem {
  id?: string;
  productId: string;
  productName: string;
  unitCost: number;
  quantityOrdered: number;
  quantityReceived?: number;
  lineTotal: number;
}

export interface Purchase {
  id: string;
  poNumber: string;
  supplierName: string;
  status: PurchaseStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  items: PurchaseItem[];
}

// For UI type backward compatibility
export type PurchaseOrder = Purchase;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dmreikncjmyldxqjjdzj.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcmVpa25jam15bGR4cWpqZHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjU3MjMsImV4cCI6MjEwMDUwMTcyM30.8G32S5rs8F9nSNVsXdxHZ27yTqf6KdGkRpYmM-MdmhE";

function getHeaders() {
  return {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };
}

class PurchaseService {
  /**
   * Fetch all purchases and join line items via REST
   */
  async getPurchases(): Promise<Purchase[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      console.log("[PurchaseService] Fetching purchase orders from Supabase REST...");
      const res = await fetch(`${SUPABASE_URL}/rest/v1/purchases?select=*,purchase_items(*)&order=created_at.desc`, {
        headers: getHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[PurchaseService Warning] REST query returned ${res.status}: ${errorText}`);
        return [];
      }

      const data = await res.json();
      return (data || []).map((p: Record<string, unknown>) => {
        const rawItems = Array.isArray(p.purchase_items) ? p.purchase_items : [];
        const mappedItems: PurchaseItem[] = rawItems.map((item: Record<string, unknown>) => ({
          id: String(item.id),
          productId: String(item.product_id),
          productName: String(item.product_name || "Product"),
          unitCost: Number(item.unit_cost ?? 0),
          quantityOrdered: Number(item.quantity_ordered ?? item.quantity ?? 0),
          quantityReceived: Number(item.quantity_received ?? 0),
          lineTotal: Number(item.line_total ?? (Number(item.unit_cost ?? 0) * Number(item.quantity_ordered ?? 0)))
        }));

        const subtotal = Number(p.subtotal ?? 0);
        const taxAmount = Number(p.tax_amount ?? 0);
        const totalAmount = Number(p.total_amount ?? p.total ?? (subtotal + taxAmount));

        return {
          id: String(p.id),
          poNumber: String(p.po_number || `PO-${p.id}`),
          supplierName: String(p.supplier_name || "General Supplier"),
          status: String(p.status || "ordered") as PurchaseStatus,
          subtotal,
          taxAmount,
          totalAmount,
          notes: p.notes ? String(p.notes) : undefined,
          createdAt: String(p.created_at || new Date().toISOString()),
          items: mappedItems
        };
      });
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("[PurchaseService Exception]:", err);
      return [];
    }
  }

  /**
   * Create a new purchase order and line items
   */
  async createPurchase(input: {
    supplierName: string;
    notes?: string;
    items: { productId: string; productName: string; unitCost: number; quantityOrdered: number }[];
  }): Promise<Purchase> {
    const poNumber = `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Calculate financial figures (16% VAT)
    const subtotal = input.items.reduce((sum, item) => sum + (item.unitCost * item.quantityOrdered), 0);
    const taxAmount = subtotal * 0.16;
    const totalAmount = subtotal + taxAmount;

    // 1. Insert master purchase order record
    const purchasePayload = {
      po_number: poNumber,
      supplier_name: input.supplierName,
      status: "ordered",
      subtotal: Number(subtotal.toFixed(2)),
      tax_amount: Number(taxAmount.toFixed(2)),
      total_amount: Number(totalAmount.toFixed(2)),
      notes: input.notes || null
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/purchases`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(purchasePayload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to create purchase order: ${errText}`);
    }

    const createdArray = await res.json();
    const createdPurchase = Array.isArray(createdArray) ? createdArray[0] : createdArray;

    // 2. Insert line items
    if (input.items && input.items.length > 0) {
      const itemsPayload = input.items.map(item => ({
        purchase_id: createdPurchase.id,
        product_id: item.productId,
        product_name: item.productName,
        unit_cost: item.unitCost,
        quantity_ordered: item.quantityOrdered,
        quantity_received: 0,
        line_total: Number((item.unitCost * item.quantityOrdered).toFixed(2))
      }));

      const itemsRes = await fetch(`${SUPABASE_URL}/rest/v1/purchase_items`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(itemsPayload)
      });

      if (!itemsRes.ok) {
        const errText = await itemsRes.text();
        console.error("Failed to insert purchase items:", errText);
      }
    }

    return {
      id: String(createdPurchase.id),
      poNumber,
      supplierName: input.supplierName,
      status: "ordered",
      subtotal,
      taxAmount,
      totalAmount,
      notes: input.notes,
      createdAt: new Date().toISOString(),
      items: input.items.map(i => ({
        productId: i.productId,
        productName: i.productName,
        unitCost: i.unitCost,
        quantityOrdered: i.quantityOrdered,
        quantityReceived: 0,
        lineTotal: i.unitCost * i.quantityOrdered
      }))
    };
  }

  /**
   * Mark purchase order as received and add quantities to inventory stock
   */
  async receivePurchase(poId: string): Promise<void> {
    // Fetch target purchase order with items
    const purchases = await this.getPurchases();
    const target = purchases.find(p => p.id === poId);
    
    if (!target) {
      throw new Error("Purchase order not found.");
    }

    if (target.status === "received") {
      throw new Error("Purchase order is already marked as received.");
    }

    // 1. Update purchase status in Supabase
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/purchases?id=eq.${poId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ 
        status: "received",
        updated_at: new Date().toISOString()
      })
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      throw new Error(`Failed to update purchase order status: ${errText}`);
    }

    // 2. Restock product stock for each ordered line item
    for (const item of target.items) {
      if (item.productId && item.quantityOrdered > 0) {
        try {
          await productService.adjustStock(item.productId, item.quantityOrdered);
        } catch (err) {
          console.error(`Failed to update inventory for product ${item.productId}:`, err);
        }
      }
    }
  }

  // --- METHOD ALIASES FOR UI COMPATIBILITY ---
  async fetchPurchases(): Promise<Purchase[]> { return this.getPurchases(); }
  async getPurchaseOrders(): Promise<Purchase[]> { return this.getPurchases(); }
}

export const purchaseService = new PurchaseService();
export default purchaseService;