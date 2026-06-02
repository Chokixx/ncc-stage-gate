import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Issues an access token for a GMAT team. The caller must know the GMAT
// stage password, preventing arbitrary users from obtaining tokens for
// rival teams.
export const getGmatTeamToken = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        team: z.string().trim().min(1).max(200),
        password: z.string().min(1).max(200),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    if (data.password !== process.env.PASS_GMAT) {
      throw new Error("Clave GMAT inválida.");
    }
    const { data: row, error } = await supabaseAdmin
      .from("gmat_teams")
      .select("name, access_token")
      .eq("name", data.team)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Equipo no encontrado.");
    return { token: (row as { access_token: string }).access_token };
  });
