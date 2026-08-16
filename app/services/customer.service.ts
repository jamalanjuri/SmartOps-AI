export interface Customer {
  id: string;
  name?: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  notes?: string;
  customer_type: string;
  loyalty_points: number;
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

function mapCustomerRow(c: Record<string, unknown>): Customer {
  const displayName = String(c.full_name || c.name || "Unnamed Customer");
  return {
    id: String(c.id),
    name: displayName,
    full_name: displayName,
    email: c.email ? String(c.email) : "",
    phone: c.phone ? String(c.phone) : "",
    address: c.address ? String(c.address) : "",
    taxNumber: c.tax_number || c.taxNumber ? String(c.tax_number || c.taxNumber) : "",
    notes: c.notes ? String(c.notes) : "",
    customer_type: String(c.customer_type || "retail"),
    loyalty_points: Number(c.loyalty_points ?? 0),
    createdAt: String(c.created_at || new Date().toISOString())
  };
}

class CustomerService {
  /**
   * Fetch all customers from Supabase REST
   */
  async getCustomers(): Promise<Customer[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      console.log("[CustomerService] Fetching customers from REST...");
      const res = await fetch(`${SUPABASE_URL}/rest/v1/customers?select=*&order=created_at.desc`, {
        headers: getHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`[CustomerService Warning] REST query returned ${res.status}`);
        return [];
      }

      const data = await res.json();
      return (data || []).map(mapCustomerRow);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      console.error("[CustomerService Exception]:", err);
      return [];
    }
  }

  /**
   * Get a single customer by ID
   */
  async getCustomerById(id: string): Promise<Customer | null> {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${id}&select=*`, {
        headers: getHeaders()
      });

      if (!res.ok) return null;
      const data = await res.json();
      if (!data || data.length === 0) return null;

      return mapCustomerRow(data[0]);
    } catch (err) {
      console.error("[CustomerService Exception] getCustomerById failed:", err);
      return null;
    }
  }

  /**
   * Register a new customer
   */
  async createCustomer(customer: Omit<Customer, "id" | "createdAt">): Promise<Customer> {
    const nameVal = customer.full_name || customer.name || "New Customer";
    const payload = {
      name: nameVal,
      full_name: nameVal,
      email: customer.email || null,
      phone: customer.phone || null,
      address: customer.address || null,
      tax_number: customer.taxNumber || null,
      notes: customer.notes || null,
      customer_type: customer.customer_type || "retail",
      loyalty_points: customer.loyalty_points || 0
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/customers`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to create customer: ${errText}`);
    }

    const data = await res.json();
    const created = Array.isArray(data) ? data[0] : data;
    return mapCustomerRow(created);
  }

  /**
   * Update an existing customer
   */
  async updateCustomer(id: string, updates: Partial<Omit<Customer, "id" | "createdAt">>): Promise<Customer> {
    const payload: Record<string, unknown> = {};
    if (updates.name !== undefined || updates.full_name !== undefined) {
      const nameVal = updates.full_name || updates.name;
      payload.name = nameVal;
      payload.full_name = nameVal;
    }
    if (updates.email !== undefined) payload.email = updates.email || null;
    if (updates.phone !== undefined) payload.phone = updates.phone || null;
    if (updates.address !== undefined) payload.address = updates.address || null;
    if (updates.taxNumber !== undefined) payload.tax_number = updates.taxNumber || null;
    if (updates.notes !== undefined) payload.notes = updates.notes || null;
    if (updates.customer_type !== undefined) payload.customer_type = updates.customer_type;
    if (updates.loyalty_points !== undefined) payload.loyalty_points = updates.loyalty_points;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to update customer: ${errText}`);
    }

    const data = await res.json();
    const updated = Array.isArray(data) ? data[0] : data;
    return mapCustomerRow(updated);
  }

  /**
   * Delete customer
   */
  async deleteCustomer(id: string): Promise<void> {
    await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
  }
}

export const customerService = new CustomerService();
export default customerService;