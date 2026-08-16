export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  expenseDate: string;
  createdAt?: string;
}

export interface CreateExpenseInput {
  category: string;
  description: string;
  amount: number;
  paymentMethod?: string;
  expenseDate?: string;
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

class ExpenseService {
  /**
   * Fetch all expenses from Supabase REST (with 5-second timeout safeguard)
   */
  async getExpenses(): Promise<Expense[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      console.log("[ExpenseService] Fetching all expenses from Supabase REST...");
      const res = await fetch(`${SUPABASE_URL}/rest/v1/expenses?select=*&order=created_at.desc`, {
        headers: getHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[ExpenseService Warning] Query returned ${res.status}: ${errorText}`);
        return [];
      }

      const data = await res.json();
      return (data || []).map((row: Record<string, unknown>) => ({
        id: String(row.id),
        category: String(row.category || "General"),
        description: String(row.description || ""),
        amount: Number(row.amount || 0),
        paymentMethod: String(row.payment_method || row.paymentMethod || "Cash"),
        expenseDate: String(
          row.expense_date ||
          (row.created_at
            ? new Date(String(row.created_at)).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0])
        ),
        createdAt: String(row.created_at || new Date().toISOString()),
      }));
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      console.error("[ExpenseService Exception]:", err);
      return [];
    }
  }

  /**
   * Create new expense record
   */
  async createExpense(input: CreateExpenseInput): Promise<Expense> {
    const payload = {
      category: input.category,
      description: input.description,
      amount: input.amount,
      payment_method: input.paymentMethod || "Cash",
      expense_date: input.expenseDate || new Date().toISOString().split("T")[0],
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/expenses`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to create expense: ${errText}`);
    }

    const data = await res.json();
    const created = Array.isArray(data) ? data[0] : data;

    return {
      id: String(created.id),
      category: String(created.category || "General"),
      description: String(created.description || ""),
      amount: Number(created.amount || 0),
      paymentMethod: String(created.payment_method || "Cash"),
      expenseDate: String(created.expense_date || payload.expense_date),
      createdAt: String(created.created_at || new Date().toISOString()),
    };
  }

  /**
   * Delete expense record by ID
   */
  async deleteExpense(id: string): Promise<void> {
    await fetch(`${SUPABASE_URL}/rest/v1/expenses?id=eq.${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
  }

  // Method Aliases for UI compatibility
  async fetchExpenses(): Promise<Expense[]> { return this.getExpenses(); }
  async logExpense(input: CreateExpenseInput): Promise<Expense> { return this.createExpense(input); }
}

export const expenseService = new ExpenseService();
export default expenseService;