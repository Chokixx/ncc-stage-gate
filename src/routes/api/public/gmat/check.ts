import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const Schema = z.object({
  team: z.string().min(1).max(200),
  retryKey: z.string().max(200).optional(),
});

export const Route = createFileRoute("/api/public/gmat/check")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const parsed = Schema.safeParse(body);
          if (!parsed.success) {
            return Response.json({ error: "Datos inválidos" }, { status: 400 });
          }
          const url =
            process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
          const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (!url || !key) {
            return Response.json(
              { error: "Backend no configurado" },
              { status: 500 },
            );
          }
          const admin = createClient(url, key, {
            auth: { persistSession: false, autoRefreshToken: false },
          });
          const { data } = await admin
            .from("gmat_submissions")
            .select("id")
            .eq("team", parsed.data.team)
            .maybeSingle();
          if (!data) return Response.json({ submitted: false });
          const retryKey = process.env.GMAT_RETRY_KEY;
          const provided = parsed.data.retryKey?.trim();
          if (retryKey && provided && provided === retryKey) {
            return Response.json({ submitted: true, allowed: true });
          }
          return Response.json({ submitted: true, allowed: false });
        } catch (e) {
          console.error("[gmat/check]", e);
          return Response.json({ error: "Error inesperado" }, { status: 500 });
        }
      },
    },
  },
});
