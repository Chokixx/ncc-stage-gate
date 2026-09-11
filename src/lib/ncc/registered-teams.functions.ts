import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { EquipoNCC } from "@/lib/ncc/equipos-2026";

export const listRegisteredTeams = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ teams: EquipoNCC[] }> => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
    const supabasePublic = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data, error } = await supabasePublic
      .from("ncc_registered_teams")
      .select("name, members")
      .order("position");

    if (error || !data || data.length === 0) {
      const { EQUIPOS_NCC_2026 } = await import("@/lib/ncc/equipos-2026");
      return { teams: EQUIPOS_NCC_2026 };
    }

    return {
      teams: data.map((t) => ({
        name: t.name,
        members: Array.isArray(t.members) ? (t.members as unknown as EquipoNCC["members"]) : [],
      })),
    };
  },
);
