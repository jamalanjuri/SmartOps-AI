export interface FinancialMetrics {
  totalRevenue: number;
  totalCOGS: number;
  grossProfit: number;
  grossMarginPercentage: number;
  totalExpenses: number;
  netProfit: number;
  netMarginPercentage: number;
  vatCollected: number;
  salesCount: number;
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

export const reportService = {
  /**
   * Aggregate live financial metrics via direct REST (5s timeout safeguard)
   */
  async getFinancialSummary(): Promise<FinancialMetrics> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      console.log("[ReportService] Fetching financial summary via direct REST...");

      const [salesRes, expensesRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/sales?select=total,subtotal,vat`, {
          headers: getHeaders(),
          signal: controller.signal
        }),
        fetch(`${SUPABASE_URL}/rest/v1/expenses?select=amount`, {
          headers: getHeaders(),
          signal: controller.signal
        })
      ]);

      clearTimeout(timeoutId);

      const salesData = salesRes.ok ? await salesRes.json() : [];
      const expensesData = expensesRes.ok ? await expensesRes.json() : [];

      // Calculate totals matching verified PostgreSQL schema columns
      const totalRevenue = (salesData || []).reduce((sum: number, s: any) => sum + Number(s.total || s.total_amount || 0), 0);
      const vatCollected = (salesData || []).reduce((sum: number, s: any) => sum + Number(s.vat || s.tax_amount || 0), 0);
      const totalExpenses = (expensesData || []).reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);

      // Estimated Cost of Goods Sold (COGS ~60% of gross revenue for retail models)
      const totalCOGS = totalRevenue > 0 ? totalRevenue * 0.6 : 0;
      const grossProfit = totalRevenue - totalCOGS;
      const grossMarginPercentage = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

      const netProfit = grossProfit - totalExpenses;
      const netMarginPercentage = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      return {
        totalRevenue,
        totalCOGS,
        grossProfit,
        grossMarginPercentage,
        totalExpenses,
        netProfit,
        netMarginPercentage,
        vatCollected,
        salesCount: salesData.length,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      console.error("[ReportService Exception] Failed to aggregate financial report:", err);
      return {
        totalRevenue: 0,
        totalCOGS: 0,
        grossProfit: 0,
        grossMarginPercentage: 0,
        totalExpenses: 0,
        netProfit: 0,
        netMarginPercentage: 0,
        vatCollected: 0,
        salesCount: 0,
      };
    }
  },
};

export default reportService;