export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description?: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
  unit: string;
  isActive: boolean;
  createdAt?: string;
}

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

class ProductService {
  async getProducts(): Promise<Product[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
        headers: getHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Supabase API Error (${res.status}): ${errorText}`);
      }

      const data = await res.json();

      return (data || []).map((p: Record<string, unknown>) => ({
        id: String(p.id),
        sku: String(p.sku || ""),
        barcode: String(p.barcode || ""),
        name: String(p.name || "Unnamed Product"),
        description: String(p.description || ""),
        category: String(p.category || "General"),
        costPrice: Number(p.cost_price ?? p.costPrice ?? 0),
        sellingPrice: Number(p.selling_price ?? p.sellingPrice ?? 0),
        stock: Number(p.stock_quantity ?? p.stock ?? p.quantity ?? 0),
        minimumStock: Number(p.minimum_stock ?? p.min_stock ?? 0),
        unit: String(p.unit || "pcs"),
        isActive: p.is_active !== false,
        createdAt: String(p.created_at || new Date().toISOString())
      }));
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("Supabase request timed out after 5 seconds.");
      }
      throw err;
    }
  }

  async getLowStockProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.stock <= p.minimumStock);
  }

  async getProduct(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  }

  async createProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
    const payload = {
      sku: product.sku,
      barcode: product.barcode || null,
      name: product.name,
      description: product.description || null,
      category: product.category || null,
      cost_price: product.costPrice,
      selling_price: product.sellingPrice,
      stock_quantity: product.stock,
      minimum_stock: product.minimumStock,
      unit: product.unit,
      is_active: product.isActive,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to create product: ${errText}`);
    }

    const data = await res.json();
    const created = Array.isArray(data) ? data[0] : data;
    return {
      id: String(created.id),
      sku: created.sku || "",
      barcode: created.barcode || "",
      name: created.name,
      description: created.description || "",
      category: created.category || "General",
      costPrice: Number(created.cost_price || 0),
      sellingPrice: Number(created.selling_price || 0),
      stock: Number(created.stock_quantity || 0),
      minimumStock: Number(created.minimum_stock || 0),
      unit: created.unit || "pcs",
      isActive: created.is_active !== false
    };
  }

  async updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product> {
    const databaseUpdates: Record<string, unknown> = {};
    if (updates.sku !== undefined) databaseUpdates.sku = updates.sku;
    if (updates.barcode !== undefined) databaseUpdates.barcode = updates.barcode || null;
    if (updates.name !== undefined) databaseUpdates.name = updates.name;
    if (updates.description !== undefined) databaseUpdates.description = updates.description || null;
    if (updates.category !== undefined) databaseUpdates.category = updates.category || null;
    if (updates.costPrice !== undefined) databaseUpdates.cost_price = updates.costPrice;
    if (updates.sellingPrice !== undefined) databaseUpdates.selling_price = updates.sellingPrice;
    if (updates.stock !== undefined) databaseUpdates.stock_quantity = updates.stock;
    if (updates.minimumStock !== undefined) databaseUpdates.minimum_stock = updates.minimumStock;
    if (updates.unit !== undefined) databaseUpdates.unit = updates.unit;
    if (updates.isActive !== undefined) databaseUpdates.is_active = updates.isActive;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(databaseUpdates)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to update product: ${errText}`);
    }

    const data = await res.json();
    const updated = Array.isArray(data) ? data[0] : data;
    return {
      id: String(updated.id),
      sku: updated.sku || "",
      barcode: updated.barcode || "",
      name: updated.name,
      description: updated.description || "",
      category: updated.category || "General",
      costPrice: Number(updated.cost_price || 0),
      sellingPrice: Number(updated.selling_price || 0),
      stock: Number(updated.stock_quantity ?? 0),
      minimumStock: Number(updated.minimum_stock || 0),
      unit: updated.unit || "pcs",
      isActive: updated.is_active !== false
    };
  }

  async adjustStock(id: string, delta: number): Promise<void> {
    const product = await this.getProduct(id);
    if (!product) throw new Error("Product not found.");

    const newStock = Math.max(0, product.stock + delta);
    await this.updateProduct(id, { stock: newStock });
  }

  async decreaseStock(id: string, quantity: number): Promise<void> {
    await this.adjustStock(id, -Math.abs(quantity));
  }

  async deleteProduct(id: string): Promise<void> {
    await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
  }
}

export const productService = new ProductService();
export default productService;