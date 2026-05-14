// Server-side helper: lista los equipos válidos desde la BD.
// NO importar desde código de cliente.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function getTeamsFromDb(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("gmat_teams")
    .select("name")
    .order("position");
  if (error) {
    console.error("[teams.server] error", error);
    return [];
  }
  return (data ?? []).map((r) => r.name);
}
