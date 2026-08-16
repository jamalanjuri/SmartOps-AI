export interface Supplier {
  id: string;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentTerms?: string;
  category?: string;
  isActive?: boolean;
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

class SupplierService {
  /**
   * Fetch all suppliers from Supabase via direct REST (with 5s timeout safeguard)
   */
  async getSuppliers(): Promise<Supplier[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      console.log("[SupplierService] Fetching suppliers from REST...");
      const res = await fetch(`${SUPABASE_URL}/rest/v1/suppliers?select=*&order=created_at.desc`, {
        headers: getHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`[SupplierService Warning] REST query returned status ${res.status}`);
        return [];
      }

      const data = await res.json();
      return (data || []).map((s: Record<string, unknown>) => ({
        id: String(s.id),
        companyName: String(s.company_name || s.companyName || s.name || "Unnamed Supplier"),
        contactName: String(s.contact_name || s.contactName || ""),
        email: String(s.email || ""),
        phone: String(s.phone || ""),
        address: String(s.address || ""),
        paymentTerms: String(s.payment_terms || s.paymentTerms || "Net 30"),
        category: String(s.category || "General"),
        isActive: s.is_active !== false,
        createdAt: String(s.created_at || new Date().toISOString())
      }));
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      console.error("[SupplierService Exception]:", err);
      return [];
    }
  }

  /**
   * Get single supplier
   */
  async getSupplierById(id: string): Promise<Supplier | null> {
    const suppliers = await this.getSuppliers();
    return suppliers.find((s) => s.id === id) || null;
  }

  /**
   * Register a new supplier
   */
  async createSupplier(supplier: Omit<Supplier, "id" | "createdAt">): Promise<Supplier> {
    const payload = {
      company_name: supplier.companyName,
      contact_name: supplier.contactName || null,
      email: supplier.email || null,
      phone: supplier.phone || null,
      address: supplier.address || null,
      payment_terms: supplier.paymentTerms || "Net 30",
      category: supplier.category || null,
      is_active: supplier.isActive !== false
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/suppliers`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to create supplier: ${errText}`);
    }

    const data = await res.json();
    const created = Array.isArray(data) ? data[0] : data;
    return {
      id: String(created.id),
      companyName: String(created.company_name || created.name || "New Supplier"),
      paymentTerms: String(created.payment_terms || "Net 30"),
      createdAt: String(created.created_at || new Date().toISOString())
    };
  }
}

export const supplierService = new SupplierService();
export default supplierService;