import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const STAGE_VALUES = ["alpha", "beta", "delta"] as const;
type Stage = (typeof STAGE_VALUES)[number];
const BUCKET = "case-submissions";

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

const safe = (s: string, n = 120) => s.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, n);

/** Step 1: issue signed upload URLs so files go straight to storage (up to 100 MB). */
export const createSubmissionUploads = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        stage: z.enum(STAGE_VALUES),
        password: z.string().min(1).max(200),
        team: z.string().min(1).max(200),
        pdfName: z.string().min(1).max(200),
        dataName: z.string().min(1).max(200).nullable().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    assertPassword(data.stage, data.password);
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
      pdf: await sign(data.pdfName, "entrega"),
      data: data.dataName ? await sign(data.dataName, "datos") : null,
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
        pdf: z.object({ path: z.string().min(1).max(400), filename: z.string().min(1).max(200) }),
        data: z
          .object({ path: z.string().min(1).max(400), filename: z.string().min(1).max(200) })
          .nullable()
          .optional(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    assertPassword(data.stage, data.password);
    const prefix = `${data.stage}/`;
    if (!data.pdf.path.startsWith(prefix) || (data.data && !data.data.path.startsWith(prefix))) {
      throw new Error("Ruta de archivo inválida.");
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

    const pdfUrl = await link(data.pdf.path);
    const dataUrl = data.data ? await link(data.data.path) : null;

    await appendSubmissionRow({
      stage: data.stage,
      team: data.team.trim(),
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      pdfUrl,
      pdfName: data.pdf.filename,
      dataUrl,
      dataName: data.data?.filename ?? null,
    });

    return { ok: true };
  });
