import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function checkPassword(provided: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD no configurado");
  if (provided !== expected) throw new Error("Contraseña incorrecta");
}

export const verifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ password: z.string().min(1).max(200) }).parse(i))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    return { ok: true };
  });

// ---------- Sponsors ----------
export const adminListSponsors = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ password: z.string().min(1).max(200) }).parse(i))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { data: rows, error } = await supabaseAdmin
      .from("sponsors")
      .select("id, tier, position, name, logo_url")
      .order("tier")
      .order("position");
    if (error) throw new Error(error.message);
    return { sponsors: rows ?? [] };
  });

const SponsorTier = z.enum(["official", "strategic", "support"]);

export const adminUpsertSponsor = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        password: z.string().min(1).max(200),
        id: z.string().uuid().optional(),
        tier: SponsorTier,
        name: z.string().min(1).max(200),
        logo_url: z.string().url().max(2000).nullable().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("sponsors")
        .update({ name: data.name, logo_url: data.logo_url ?? null, tier: data.tier })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }
    // new: append at next position for tier
    const { data: maxRow } = await supabaseAdmin
      .from("sponsors")
      .select("position")
      .eq("tier", data.tier)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextPos = (maxRow?.position ?? 0) + 1;
    const { error } = await supabaseAdmin.from("sponsors").insert({
      tier: data.tier,
      position: nextPos,
      name: data.name,
      logo_url: data.logo_url ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteSponsor = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({ password: z.string().min(1).max(200), id: z.string().uuid() })
      .parse(i),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { error } = await supabaseAdmin.from("sponsors").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUploadSponsorLogo = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        password: z.string().min(1).max(200),
        sponsorId: z.string().uuid(),
        filename: z.string().min(1).max(200),
        contentType: z.string().min(1).max(100),
        base64: z.string().min(1).max(8_000_000),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${data.sponsorId}/${Date.now()}_${safeName}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("sponsor-logos")
      .upload(path, bytes, { contentType: data.contentType, upsert: true });
    if (upErr) throw new Error(upErr.message);
    const { data: pub } = supabaseAdmin.storage.from("sponsor-logos").getPublicUrl(path);
    const { error } = await supabaseAdmin
      .from("sponsors")
      .update({ logo_url: pub.publicUrl })
      .eq("id", data.sponsorId);
    if (error) throw new Error(error.message);
    return { url: pub.publicUrl };
  });

// ---------- GMAT Teams ----------
export const adminListTeams = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ password: z.string().min(1).max(200) }).parse(i))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { data: rows, error } = await supabaseAdmin
      .from("gmat_teams")
      .select("id, position, name")
      .order("position");
    if (error) throw new Error(error.message);
    return { teams: rows ?? [] };
  });

export const adminUpdateTeam = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        password: z.string().min(1).max(200),
        id: z.string().uuid(),
        name: z.string().min(1).max(200),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { error } = await supabaseAdmin
      .from("gmat_teams")
      .update({ name: data.name })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminAddTeam = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        password: z.string().min(1).max(200),
        name: z.string().min(1).max(200),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { data: maxRow } = await supabaseAdmin
      .from("gmat_teams")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextPos = (maxRow?.position ?? 0) + 1;
    const { error } = await supabaseAdmin
      .from("gmat_teams")
      .insert({ position: nextPos, name: data.name });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteTeam = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({ password: z.string().min(1).max(200), id: z.string().uuid() })
      .parse(i),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { error } = await supabaseAdmin
      .from("gmat_teams")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReplaceTeams = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        password: z.string().min(1).max(200),
        names: z.array(z.string().min(1).max(200)).min(1).max(500),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    // Replace all: delete then insert
    const { error: delErr } = await supabaseAdmin
      .from("gmat_teams")
      .delete()
      .gte("position", 0);
    if (delErr) throw new Error(delErr.message);
    const rows = data.names.map((name, i) => ({ position: i + 1, name }));
    const { error } = await supabaseAdmin.from("gmat_teams").insert(rows);
    if (error) throw new Error(error.message);
    return { ok: true, count: rows.length };
  });
