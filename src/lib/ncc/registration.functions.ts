import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ParticipantSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  cedula: z.string().trim().regex(/^[0-9]{4,15}$/, "Cédula inválida"),
  email: z.string().trim().email().max(200),
});

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        mode: z.enum(["solo", "team"]),
        participants: z.array(ParticipantSchema).min(1).max(4),
        proof: z
          .object({
            filename: z.string().min(1).max(200),
            contentType: z
              .string()
              .regex(/^image\/(jpeg|jpg|png|webp)$/i, "Tipo no permitido"),
            base64: z.string().min(1).max(8_000_000),
          })
          .nullable(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    let proofUrl: string | null = null;
    if (data.proof) {
      const bytes = Uint8Array.from(atob(data.proof.base64), (c) =>
        c.charCodeAt(0),
      );
      const safeName = data.proof.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${Date.now()}_${crypto.randomUUID()}_${safeName}`;
      const { error: upErr } = await supabaseAdmin.storage
        .from("registration-proofs")
        .upload(path, bytes, {
          contentType: data.proof.contentType,
          upsert: false,
        });
      if (upErr) throw new Error(upErr.message);
      const { data: pub } = supabaseAdmin.storage
        .from("registration-proofs")
        .getPublicUrl(path);
      proofUrl = pub.publicUrl;
    }

    const { error } = await supabaseAdmin.from("registrations").insert({
      mode: data.mode,
      participants: data.participants,
      proof_url: proofUrl,
      contact_email: data.participants[0].email,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
