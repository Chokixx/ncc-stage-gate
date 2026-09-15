import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const STAGE_VALUES = ["gmat", "alpha", "beta", "delta"] as const;
type Stage = (typeof STAGE_VALUES)[number];

function passwordFor(stage: Stage): string | undefined {
  // Accept either PASS_X (runtime secret) or VITE_PASS_X (build-time env)
  // so the gate keeps working whichever channel the value is stored in.
  const pick = (...keys: string[]) =>
    keys.map((k) => process.env[k]).find((v) => typeof v === "string" && v.length > 0);
  switch (stage) {
    case "gmat":
      return pick("PASS_GMAT", "VITE_PASS_GMAT");
    case "alpha":
      return pick("PASS_ALPHA", "VITE_PASS_ALPHA");
    case "beta":
      return pick("PASS_BETA", "VITE_PASS_BETA");
    case "delta":
      return pick("PASS_DELTA", "VITE_PASS_DELTA", "VITE_PASS_OMEGA");
  }
}

const PUBLIC_COLUMNS =
  "intro, sponsor_enabled, sponsor_name, sponsor_logo_url, sponsor_link";
export const getStageContent = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        stage: z.enum(STAGE_VALUES),
        password: z.string().max(200).optional().nullable(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const expected = passwordFor(data.stage);
    const unlocked =
      !!expected && !!data.password && data.password === expected;

    const query = supabaseAdmin.from("stage_content");
    const result = unlocked
      ? await query
          .select("intro, sponsor_enabled, sponsor_name, sponsor_logo_url, sponsor_link, case_pdf_name, case_data_enabled, case_data_name")
          .eq("stage", data.stage)
          .maybeSingle()
      : await query
          .select(PUBLIC_COLUMNS)
          .eq("stage", data.stage)
          .maybeSingle();
    const { data: row, error } = result;
    if (error) throw new Error(error.message);
    const fileNames = row as typeof row & {
      case_pdf_name?: string | null;
      case_data_enabled?: boolean;
      case_data_name?: string | null;
    };
    return {
      content: row
        ? {
            ...row,
            case_pdf_available: unlocked && Boolean(fileNames.case_pdf_name),
            case_data_enabled: fileNames.case_data_enabled ?? true,
            case_data_available:
              unlocked &&
              (fileNames.case_data_enabled ?? true) &&
              Boolean(fileNames.case_data_name),
          }
        : null,
      unlocked,
    };
  });

export const verifyStagePassword = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    z
      .object({
        stage: z.enum(STAGE_VALUES),
        password: z.string().min(1).max(200),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const expected = passwordFor(data.stage);
    if (!expected) return { ok: false as const };
    return { ok: data.password === expected };
  });
