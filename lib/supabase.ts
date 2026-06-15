import { createClient } from "@supabase/supabase-js";

export type ConnectionMessage = {
  id: number;
  body: string;
  created_at: string;
};

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    return null;
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getMessages(): Promise<ConnectionMessage[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("connection_messages")
    .select("id, body, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
}

export async function addMessage(body: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase.from("connection_messages").insert({ body });
  if (error) throw error;
}
