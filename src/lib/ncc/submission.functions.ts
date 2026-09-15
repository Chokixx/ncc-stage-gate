import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const STAGE_VALUES = ["alpha", "beta", "delta"] as const;
type Stage = (typeof STAGE_VALUES)[number];

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

const FileSchema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(120),
  base64: z.string().min(1).max(34_000_000),
});

export const submitCaseFiles = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        stage: z.enum(STAGE_VALUES),
        password: z.string().min(1).max(200),
        team: z.string().min(1).max(200),
        fullName: z.string().min(3).max(200),
        email: z.string().email().max(254),
        pdf: FileSchema,
        data: FileSchema.nullable().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const expected = passwordFor(data.stage);
    if (!expected || data.password !== expected) {
      throw new Error("Acceso no autorizado para esta etapa.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { appendSubmissionRow } = await import("./submission-sheets.server");

    const stamp = Date.now();
    const safeTeam = data.team.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);

    const upload = async (file: z.infer<typeof FileSchema>, tag: string) => {
      const bytes = Uint8Array.from(atob(file.base64), (c) => c.charCodeAt(0));
      const safeName = file.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${data.stage}/${safeTeam}/${stamp}_${tag}_${safeName}`;
      const { error } = await supabaseAdmin.storage
        .from("case-submissions")
        .upload(path, bytes, { contentType: file.contentType, upsert: true });
      if (error) throw new Error(error.message);
      const { data: signed, error: signErr } = await supabaseAdmin.storage
        .from("case-submissions")
        .createSignedUrl(path, 60 * 60 * 24 * 365);
      if (signErr || !signed) throw new Error(signErr?.message ?? "No se pudo generar el enlace.");
      return signed.signedUrl;
    };

    const pdfUrl = await upload(data.pdf, "entrega");
    const dataUrl = data.data ? await upload(data.data, "datos") : null;

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
