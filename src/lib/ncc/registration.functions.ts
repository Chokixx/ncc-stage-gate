import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { appendRegistrationRows } from "./registration-sheets.server";

const ParticipantSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  cedula: z.string().trim().regex(/^[0-9]{4,15}$/, "Cédula inválida"),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().regex(/^[0-9]{7,15}$/, "Celular inválido"),
  university: z.string().trim().min(2).max(150),
  program: z.string().trim().min(2).max(150),
  semester: z.string().trim().min(1).max(20),
});

const FileSchema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z
    .string()
    .regex(/^(image\/(jpeg|jpg|png|webp)|application\/pdf)$/i, "Tipo no permitido"),
  base64: z.string().min(1).max(10_000_000),
});

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        mode: z.enum(["solo", "team"]),
        teamName: z.string().trim().max(120).optional().nullable(),
        participants: z.array(ParticipantSchema).min(1).max(4),
        proof: FileSchema.nullable(),
        consent: FileSchema.nullable(),
      })
      .superRefine((val, ctx) => {
        if (val.mode === "team") {
          if (val.participants.length !== 4) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "El equipo debe tener exactamente 4 integrantes.",
              path: ["participants"],
            });
          }
          if (!val.teamName || val.teamName.trim().length < 2) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "El nombre del equipo es obligatorio.",
              path: ["teamName"],
            });
          }
        }
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const uploadFile = async (file: {
      filename: string;
      contentType: string;
      base64: string;
    }) => {
      const bytes = Uint8Array.from(atob(file.base64), (c) => c.charCodeAt(0));
      const safeName = file.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${Date.now()}_${crypto.randomUUID()}_${safeName}`;
      const { error: upErr } = await supabaseAdmin.storage
        .from("registration-proofs")
        .upload(path, bytes, {
          contentType: file.contentType,
          upsert: false,
        });
      if (upErr) throw new Error(upErr.message);
      const { data: pub } = supabaseAdmin.storage
        .from("registration-proofs")
        .getPublicUrl(path);
      return pub.publicUrl;
    };

    const proofUrl = data.proof ? await uploadFile(data.proof) : null;
    const consentUrl = data.consent ? await uploadFile(data.consent) : null;

    const teamName =
      data.mode === "team"
        ? (data.teamName ?? "").trim()
        : (data.teamName ?? "").trim() || `Individual — ${data.participants[0].fullName}`;

    const { error } = await supabaseAdmin.from("registrations").insert({
      mode: data.mode,
      team_name: teamName,
      participants: data.participants,
      proof_url: proofUrl,
      consent_url: consentUrl,
      contact_email: data.participants[0].email,
    });
    if (error) throw new Error(error.message);

    // Sheets no debe bloquear la inscripción si falla
    try {
      await appendRegistrationRows({
        teamName,
        mode: data.mode,
        participants: data.participants,
        proofUrl,
        consentUrl,
      });
    } catch (e) {
      console.error("Sheets append falló:", e);
    }


    return { ok: true };
  });
