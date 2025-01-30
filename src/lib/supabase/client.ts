import {
  createBrowserClient
} from "@supabase/ssr";
import { createClient as createDefaultClient } from "@supabase/supabase-js";

function createClient() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return supabase;
}

export const supabaseDefaultClient = createDefaultClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const supabase = createClient();
