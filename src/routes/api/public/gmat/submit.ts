import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getTeamsFromDb } from "@/lib/ncc/teams.server";
import { GMAT_QUESTIONS, GMAT_QUIZ_SIZE } from "@/lib/ncc/gmat-questions";
import { GMAT_CORRECT_ANSWERS } from "@/lib/ncc/gmat-answers.server";

const VALID_IDS = new Set(GMAT_QUESTIONS.map((q) => q.id));

const SubmissionSchema = z.object({
  team: z.string().min(1).max(200),
  questionIds: z
    .array(z.number().int())
    .length(GMAT_QUIZ_SIZE)
    .refine((ids) => ids.every((id) => VALID_IDS.has(id)), {
      message: "IDs de pregunta inválidos",
    })
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "IDs de pregunta duplicados",
    }),
  answers: z
    .array(z.number().int().min(-1).max(4))
    .length(GMAT_QUIZ_SIZE),
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

          const { team, questionIds, answers, startedAt } = parsed.data;

          const validTeams = await getTeamsFromDb();
          if (!validTeams.includes(team)) {
            return Response.json(
              { error: "Equipo no autorizado" },
              { status: 403 },
            );
          }

          // Calcular puntaje según las preguntas asignadas a este intento
          let score = 0;
          questionIds.forEach((qid, idx) => {
            if (answers[idx] === GMAT_CORRECT_ANSWERS[qid]) score += 1;
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

          // Bloquear reintentos
          const { data: existing } = await admin
            .from("gmat_submissions")
            .select("id")
            .eq("team", team)
            .maybeSingle();
          if (existing) {
            return Response.json(
              { error: "Este equipo ya envió el examen." },
              { status: 409 },
            );
          }

          const { data, error } = await admin
            .from("gmat_submissions")
            .insert({
              team,
              answers: { questionIds, answers },
              score,
              total: GMAT_QUIZ_SIZE,
              started_at: startedAt ?? null,
            })
            .select("id, submitted_at, started_at")
            .single();

          if (error) {
            if ((error as { code?: string }).code === "23505") {
              return Response.json(
                { error: "Este equipo ya envió el examen." },
                { status: 409 },
              );
            }
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
              total: GMAT_QUIZ_SIZE,
              started_at: data.started_at ?? startedAt ?? null,
              submitted_at: data.submitted_at,
              answers,
            });
            const { data: allRows, error: listErr } = await admin
              .from("gmat_submissions")
              .select("team, score, total, started_at, submitted_at, answers")
              .order("score", { ascending: false })
              .order("submitted_at", { ascending: true })
              .limit(500);
            if (listErr) throw listErr;
            const normalized = (allRows ?? []).map((r: {
              team: string;
              score: number;
              total: number;
              started_at: string | null;
              submitted_at: string;
              answers: unknown;
            }) => {
              const a = r.answers;
              const ans = Array.isArray(a)
                ? (a as number[])
                : Array.isArray((a as { answers?: number[] })?.answers)
                  ? ((a as { answers: number[] }).answers)
                  : [];
              return { ...r, answers: ans };
            });
            await rewriteTop50(normalized);
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
              total: GMAT_QUIZ_SIZE,
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
            total: GMAT_QUIZ_SIZE,
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
