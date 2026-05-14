import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getTeams } from "@/lib/ncc/teams";
import { GMAT_QUESTIONS } from "@/lib/ncc/gmat-questions";

const SubmissionSchema = z.object({
  team: z.string().min(1).max(200),
  answers: z
    .array(z.number().int().min(-1).max(20))
    .length(GMAT_QUESTIONS.length),
  startedAt: z.string().datetime().optional(),
});

export const Route = createFileRoute("/api/public/gmat/submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const parsed = SubmissionSchema.safeParse(body);
          if (!parsed.success) {
            return Response.json(
              { error: "Datos inválidos", details: parsed.error.flatten() },
              { status: 400 },
            );
          }

          const { team, answers, startedAt } = parsed.data;

          const validTeams = getTeams();
          if (!validTeams.includes(team)) {
            return Response.json(
              { error: "Equipo no autorizado" },
              { status: 403 },
            );
          }

          // Calcular puntaje
          let score = 0;
          GMAT_QUESTIONS.forEach((q, idx) => {
            if (answers[idx] === q.correctIndex) score += 1;
          });

          const supabaseUrl =
            process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (!supabaseUrl || !serviceKey) {
            return Response.json(
              { error: "Backend no configurado" },
              { status: 500 },
            );
          }

          const admin = createClient(supabaseUrl, serviceKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          });

          const { data, error } = await admin
            .from("gmat_submissions")
            .insert({
              team,
              answers,
              score,
              total: GMAT_QUESTIONS.length,
              started_at: startedAt ?? null,
            })
            .select("id, submitted_at, started_at")
            .single();

          if (error) {
            console.error("[gmat/submit] insert error", error);
            return Response.json(
              { error: "No se pudo registrar el intento" },
              { status: 500 },
            );
          }

          // Sincronizar Google Sheets (no rompe la respuesta si falla)
          try {
            const { appendResultRow, rewriteTop50 } = await import(
              "@/lib/ncc/gmat-sheets.server"
            );
            await appendResultRow({
              team,
              score,
              total: GMAT_QUESTIONS.length,
              started_at: data.started_at ?? startedAt ?? null,
              submitted_at: data.submitted_at,
            });
            const { data: allRows, error: listErr } = await admin
              .from("gmat_submissions")
              .select("team, score, total, started_at, submitted_at")
              .order("score", { ascending: false })
              .order("submitted_at", { ascending: true })
              .limit(500);
            if (listErr) throw listErr;
            await rewriteTop50((allRows ?? []) as never);
          } catch (sheetErr) {
            console.error("[gmat/submit] sheets sync error", sheetErr);
          }

          // Notificación por correo (no rompe la respuesta si falla)
          try {
            const { sendGmatResultEmail } = await import(
              "@/lib/ncc/gmat-email.server"
            );
            await sendGmatResultEmail({
              team,
              score,
              total: GMAT_QUESTIONS.length,
              started_at: data.started_at ?? startedAt ?? null,
              submitted_at: data.submitted_at,
              answers,
            });
          } catch (mailErr) {
            console.error("[gmat/submit] email error", mailErr);
          }

          return Response.json({
            ok: true,
            id: data.id,
            score,
            total: GMAT_QUESTIONS.length,
          });
        } catch (err) {
          console.error("[gmat/submit] unexpected error", err);
          return Response.json(
            { error: "Error inesperado" },
            { status: 500 },
          );
        }
      },
    },
  },
});
