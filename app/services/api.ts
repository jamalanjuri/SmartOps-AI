import { supabase } from "@/lib/supabase/client";

// Fail-safe wrapper that enforces a max 3-second query limit
export async function safeFetch<T>(
  queryPromise: Promise<{ data: T | null; error: any }>,
  fallbackValue: T
): Promise<T> {
  const timeout = new Promise<T>((resolve) =>
    setTimeout(() => resolve(fallbackValue), 3000)
  );

  const fetch = queryPromise
    .then(({ data, error }) => {
      if (error) {
        console.error("Supabase Query Error:", error);
        return fallbackValue;
      }
      return data ?? fallbackValue;
    })
    .catch((err) => {
      console.error("Supabase Network Exception:", err);
      return fallbackValue;
    });

  return Promise.race([fetch, timeout]);
}