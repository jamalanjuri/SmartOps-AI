export interface SaleItem {
  id?: string;
  productId?: string;
  product_id?: string;
  name?: string;
  productName?: string;
  product_name?: string;
  unitPrice?: number;
  unit_price?: number;
  quantity: number;
  total?: number;
  subtotal?: number;
}

export interface Sale {
  id?: string;
  receiptNumber?: string;
  receipt_number?: string;
  customerId?: string;
  customer_id?: string;
  customerName?: string;
  customer_name?: string;
  customer?: { name: string };
  cashier?: string;
  cashier_name?: string;
  items?: SaleItem[];
  totalAmount?: number;
  total?: number;
  subtotal?: number;
  vat?: number;
  discountAmount?: number;
  discount?: number;
  paymentMethod?: string;
  payment_method?: string;
  payment?: {
    method: string;
    amountReceived: number;
    change: number;
  };
  status?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  totals?: {
    subtotal: number;
    vat: number;
    discount: number;
    total: number;
  };
}

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://dmreikncjmyldxqjjdzj.supabase.co";

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcmVpa25jam15bGR4cWpqZHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjU3MjMsImV4cCI6MjEwMDUwMTcyM30.8G32S5rs8F9nSNVsXdxHZ27yTqf6KdGkRpYmM-MdmhE";

function getHeaders() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

class SaleService {
  completeSale(saleInput: any): any {
    const timestamp = new Date().toISOString();
    return {
      ...saleInput,
      receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  async saveSale(saleData: any): Promise<Sale> {
    const receiptNumber =
      saleData.receiptNumber ||
      saleData.receipt_number ||
      `RCP-${Date.now().toString().slice(-6)}`;
    const items = saleData.items || [];

    const calculatedTotal = items.reduce(
      (acc: number, item: any) =>
        acc +
        Number(item.unitPrice || item.price || item.unit_price || 0) *
          Number(item.quantity || 1),
      0
    );

    const totalVal = Number(
      saleData.total ??
        saleData.totalAmount ??
        saleData.totals?.total ??
        calculatedTotal ??
        0
    );
    const subtotalVal = Number(
      saleData.subtotal ??
        saleData.totals?.subtotal ??
        (totalVal > 0 ? totalVal / 1.16 : 0)
    );
    const vatVal = Number(
      saleData.vat ?? saleData.totals?.vat ?? totalVal - subtotalVal
    );
    const discountVal = Number(
      saleData.discount ??
        saleData.discountAmount ??
        saleData.totals?.discount ??
        0
    );
    const paymentMethodVal = String(
      saleData.paymentMethod ||
        saleData.payment_method ||
        saleData.payment?.method ||
        "cash"
    ).toUpperCase();
    const amountReceivedVal = Number(
      saleData.amountReceived ??
        saleData.payment?.amountReceived ??
        totalVal
    );
    const changeAmountVal = Math.max(0, amountReceivedVal - totalVal);
    const nowIso = new Date().toISOString();

    const salePayload = {
      receipt_number: receiptNumber,
      customer_id: saleData.customerId || saleData.customer_id || null,
      customer_name:
        saleData.customerName ||
        saleData.customer_name ||
        saleData.customer?.name ||
        "Walk-in Customer",
      cashier: saleData.cashier || saleData.cashier_name || "Admin",
      subtotal: Number(subtotalVal.toFixed(2)),
      vat: Number(vatVal.toFixed(2)),
      discount: Number(discountVal.toFixed(2)),
      total: Number(totalVal.toFixed(2)),
      payment_method: paymentMethodVal,
      amount_received: Number(amountReceivedVal.toFixed(2)),
      change_amount: Number(changeAmountVal.toFixed(2)),
      status: saleData.status || "completed",
    };

    const saleRes = await fetch(`${SUPABASE_URL}/rest/v1/sales`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(salePayload),
    });

    if (!saleRes.ok) {
      const errText = await saleRes.text();
      throw new Error(`Failed to save sale: ${errText}`);
    }

    const createdSaleArray = await saleRes.json();
    const createdSale = Array.isArray(createdSaleArray)
      ? createdSaleArray[0]
      : createdSaleArray;

    if (items.length > 0) {
      const itemsPayload = items.map((item: any) => {
        const itemPrice = Number(
          item.unitPrice || item.price || item.unit_price || 0
        );
        const itemQty = Number(item.quantity || 1);

        return {
          sale_id: createdSale.id,
          product_id: item.productId || item.product_id || item.id,
          product_name:
            item.name || item.productName || item.product_name || "Product",
          unit_price: Number(itemPrice.toFixed(2)),
          quantity: itemQty,
        };
      });

      const itemsRes = await fetch(`${SUPABASE_URL}/rest/v1/sale_items`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(itemsPayload),
      });

      if (!itemsRes.ok) {
        const itemsErrText = await itemsRes.text();
        console.error("Failed to save sale items:", itemsErrText);
      }
    }

    return {
      id: String(createdSale.id),
      receiptNumber,
      receipt_number: receiptNumber,
      customerName: salePayload.customer_name,
      customer_name: salePayload.customer_name,
      customer: { name: salePayload.customer_name },
      cashier: salePayload.cashier,
      cashier_name: salePayload.cashier,
      totalAmount: salePayload.total,
      total: salePayload.total,
      subtotal: salePayload.subtotal,
      vat: salePayload.vat,
      discountAmount: salePayload.discount,
      discount: salePayload.discount,
      paymentMethod: salePayload.payment_method,
      payment_method: salePayload.payment_method,
      payment: {
        method: salePayload.payment_method,
        amountReceived: salePayload.amount_received,
        change: salePayload.change_amount,
      },
      totals: {
        subtotal: salePayload.subtotal,
        vat: salePayload.vat,
        discount: salePayload.discount,
        total: salePayload.total,
      },
      status: salePayload.status,
      createdAt: nowIso,
      created_at: nowIso,
      updatedAt: nowIso,
      updated_at: nowIso,
      items,
    };
  }

  async getSales(): Promise<Sale[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/sales?select=*,sale_items(*)&order=created_at.desc`,
        {
          headers: getHeaders(),
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (!res.ok) return [];

      const data = await res.json();
      return (data || []).map((s: Record<string, any>) => {
        const rawItems = Array.isArray(s.sale_items) ? s.sale_items : [];
        const totalVal = Number(s.total ?? s.total_amount ?? 0);
        const subtotalVal = Number(
          s.subtotal ?? (totalVal > 0 ? totalVal / 1.16 : 0)
        );
        const vatVal = Number(s.vat ?? totalVal - subtotalVal);
        const discountVal = Number(s.discount ?? s.discount_amount ?? 0);
        const methodVal = String(s.payment_method || "CASH").toUpperCase();
        const receivedVal = Number(s.amount_received ?? totalVal);
        const changeVal = Number(
          s.change_amount ?? Math.max(0, receivedVal - totalVal)
        );
        const createdDate = String(s.created_at || new Date().toISOString());
        const updatedDate = String(
          s.updated_at || s.created_at || new Date().toISOString()
        );
        const receiptNo = String(s.receipt_number || `RCP-${s.id}`);
        const custName = String(s.customer_name || "Walk-in Customer");
        const cashierName = String(s.cashier || "Admin");

        const mappedItems: SaleItem[] = rawItems.map(
          (item: Record<string, any>) => {
            const unitPrice = Number(item.unit_price || 0);
            const qty = Number(item.quantity || 0);
            const itemTotal = Number(
              item.total ?? item.subtotal ?? unitPrice * qty
            );

            return {
              id: String(item.id),
              productId: String(item.product_id),
              product_id: String(item.product_id),
              productName: String(item.product_name || "Product"),
              product_name: String(item.product_name || "Product"),
              name: String(item.product_name || "Product"),
              unitPrice: unitPrice,
              unit_price: unitPrice,
              quantity: qty,
              subtotal: itemTotal,
              total: itemTotal,
            };
          }
        );

        return {
          id: String(s.id),
          receiptNumber: receiptNo,
          receipt_number: receiptNo,
          customerId: s.customer_id ? String(s.customer_id) : undefined,
          customer_id: s.customer_id ? String(s.customer_id) : undefined,
          customerName: custName,
          customer_name: custName,
          customer: { name: custName },
          cashier: cashierName,
          cashier_name: cashierName,
          totalAmount: totalVal,
          total: totalVal,
          subtotal: subtotalVal,
          vat: vatVal,
          discountAmount: discountVal,
          discount: discountVal,
          paymentMethod: methodVal,
          payment_method: methodVal,
          payment: {
            method: methodVal,
            amountReceived: receivedVal,
            change: changeVal,
          },
          totals: {
            subtotal: subtotalVal,
            vat: vatVal,
            discount: discountVal,
            total: totalVal,
          },
          status: String(s.status || "completed"),
          createdAt: createdDate,
          created_at: createdDate,
          updatedAt: updatedDate,
          updated_at: updatedDate,
          items: mappedItems,
        };
      });
    } catch {
      clearTimeout(timeoutId);
      return [];
    }
  }

  async fetchSales(): Promise<Sale[]> {
    return this.getSales();
  }
  async createSale(saleData: any): Promise<Sale> {
    return this.saveSale(saleData);
  }
  async processSale(saleData: any): Promise<Sale> {
    return this.saveSale(saleData);
  }
}

export const saleService = new SaleService();
export default saleService;