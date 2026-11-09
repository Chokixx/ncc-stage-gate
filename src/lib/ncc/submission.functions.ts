import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const STAGE_VALUES = ["alpha", "beta", "delta"] as const;
type Stage = (typeof STAGE_VALUES)[number];
const BUCKET = "case-submissions";
const MAX_MEMBERS = 10;

function passwordFor(stage: Stage): string | undefined {
  const pick = (...keys: string[]) =>
    keys.map((k) => process.env[k]).find((v) => typeof v === "string" && v.length > 0);
  switch (stage) {
    case "alpha":
      return pick("PASS_ALPHA", "VITE_PASS_ALPHA");
    case "beta":
      return pick("PASS_BETA", "VITE_PASS_BETA");
    case "delta":
      return pick("PASS_DELTA", "VITE_PASS_DELTA", "VITE_PASS_OMEGA");
  }
}

function assertPassword(stage: Stage, password: string) {
  const expected = passwordFor(stage);
  if (!expected || password !== expected) {
    throw new Error("Acceso no autorizado para esta etapa.");
  }
}

// El requisito del NDA se decide en el panel de administración, no en el navegador.
async function stageRequiresNda(stage: Stage) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("stage_content")
    .select("nda_enabled")
    .eq("stage", stage)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return Boolean(data?.nda_enabled);
}

export const YOUTUBE_URL_RE = /^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\/\S+$/i;
// Delta se entrega solo con un enlace de YouTube; las demás etapas con PDF.
const usesYoutube = (stage: Stage) => stage === "delta";

const safe = (s: string, n = 120) => s.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, n);

/** Step 1: issue signed upload URLs so files go straight to storage (up to 100 MB). */
export const createSubmissionUploads = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        stage: z.enum(STAGE_VALUES),
        password: z.string().min(1).max(200),
        team: z.string().min(1).max(200),
        pdfName: z.string().min(1).max(200).nullable().optional(),
        dataName: z.string().min(1).max(200).nullable().optional(),
        ndaNames: z.array(z.string().min(1).max(200)).max(MAX_MEMBERS).default([]),
        ndaMembers: z.array(z.string().min(2).max(120)).max(MAX_MEMBERS).default([]),
        annexNames: z.array(z.string().min(1).max(200)).max(10).default([]),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    assertPassword(data.stage, data.password);
    if (await stageRequiresNda(data.stage)) {
      if (data.ndaNames.length === 0) {
        throw new Error("Esta etapa exige subir el NDA firmado por cada integrante.");
      }
      if (data.stage === "delta") {
        const { validateTeamNda } = await import("./nda-roster.server");
        await validateTeamNda(data.team, data.ndaMembers);
        if (data.ndaNames.length !== data.ndaMembers.length || data.ndaNames.some((name) => !name.toLowerCase().endsWith(".pdf"))) {
          throw new Error("Adjunta un comprobante individual en PDF por cada integrante.");
        }
      }
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const stamp = Date.now();
    const base = `${data.stage}/${safe(data.team.trim(), 60)}/${stamp}`;
    const sign = async (name: string, tag: string) => {
      const path = `${base}_${tag}_${safe(name)}`;
      const { data: s, error } = await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUploadUrl(path);
      if (error || !s) throw new Error(error?.message ?? "No se pudo preparar la subida.");
      return { path, token: s.token };
    };
    return {
      pdf: data.pdfName && !usesYoutube(data.stage) ? await sign(data.pdfName, "entrega") : null,
      data: data.dataName && !usesYoutube(data.stage) ? await sign(data.dataName, "datos") : null,
      nda: await Promise.all(data.ndaNames.map((name, index) => sign(name, `nda${index + 1}`))),
      annexes: await Promise.all(data.annexNames.map((name, index) => sign(name, `anexo${index + 1}`))),
    };
  });

/** Step 2: after uploading, register the submission in Sheets. */
export const submitCaseFiles = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        stage: z.enum(STAGE_VALUES),
        password: z.string().min(1).max(200),
        team: z.string().min(1).max(200),
        fullName: z.string().min(3).max(200),
        email: z.string().email().max(254),
        pdf: z.object({ path: z.string().min(1).max(400), filename: z.string().min(1).max(200) }).nullable().optional(),
        youtubeUrl: z.string().max(500).nullable().optional(),
        data: z
          .object({ path: z.string().min(1).max(400), filename: z.string().min(1).max(200) })
          .nullable()
          .optional(),
        nda: z
          .array(
            z.object({
              path: z.string().min(1).max(400),
              filename: z.string().min(1).max(200),
              member: z.string().min(2).max(120),
            }),
          )
          .max(MAX_MEMBERS)
          .default([]),
        annexes: z
          .array(z.object({ path: z.string().min(1).max(400), filename: z.string().min(1).max(200) }))
          .max(10)
          .default([]),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    assertPassword(data.stage, data.password);
    const prefix = `${data.stage}/`;
    const ndaPaths = data.nda.map((item) => item.path);
    if (
      (data.pdf && !data.pdf.path.startsWith(prefix)) ||
      (data.data && !data.data.path.startsWith(prefix)) ||
      ndaPaths.some((path) => !path.startsWith(prefix)) ||
      data.annexes.some((item) => !item.path.startsWith(prefix))
    ) {
      throw new Error("Ruta de archivo inválida.");
    }
    const youtubeUrl = data.youtubeUrl?.trim() || null;
    if (usesYoutube(data.stage)) {
      if (!youtubeUrl || !YOUTUBE_URL_RE.test(youtubeUrl)) {
        throw new Error("Pega un enlace válido de YouTube.");
      }
    } else if (!data.pdf) {
      throw new Error("Adjunta el caso resuelto en PDF.");
    }
    if (await stageRequiresNda(data.stage)) {
      if (data.nda.length === 0) throw new Error("Esta etapa exige subir el NDA firmado por cada integrante.");
      if (data.stage === "delta") {
        const { validateTeamNda } = await import("./nda-roster.server");
        await validateTeamNda(data.team, data.nda.map((item) => item.member));
        if (new Set(ndaPaths).size !== ndaPaths.length || data.nda.some((item) => !item.filename.toLowerCase().endsWith(".pdf"))) {
          throw new Error("Adjunta un PDF individual distinto por cada integrante.");
        }
      }
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { appendSubmissionRow } = await import("./submission-sheets.server");

    const link = async (path: string) => {
      const { data: signed, error } = await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(path, 60 * 60 * 24 * 365);
      if (error || !signed) throw new Error(error?.message ?? "No se encontró el archivo subido.");
      return signed.signedUrl;
    };

    const pdfUrl = data.pdf && !usesYoutube(data.stage) ? await link(data.pdf.path) : null;
    const dataUrl = data.data && !usesYoutube(data.stage) ? await link(data.data.path) : null;
    const nda = await Promise.all(
      data.nda.map(async (item) => ({ member: item.member.trim(), url: await link(item.path) })),
    );

    const annexes = await Promise.all(
      data.annexes.map(async (item) => ({ name: item.filename, url: await link(item.path) })),
    );

    await appendSubmissionRow({
      annexes,
      stage: data.stage,
      team: data.team.trim(),
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      pdfUrl,
      pdfName: data.pdf?.filename ?? null,
      youtubeUrl,
      dataUrl,
      dataName: data.data?.filename ?? null,
      nda,
    });

    return { ok: true };
  });
