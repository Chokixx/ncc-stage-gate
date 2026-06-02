import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const STAGE_VALUES = ["gmat", "alpha", "beta", "delta"] as const;
type Stage = (typeof STAGE_VALUES)[number];

function passwordFor(stage: Stage): string | undefined {
  switch (stage) {
    case "gmat":
      return process.env.PASS_GMAT;
    case "alpha":
      return process.env.PASS_ALPHA;
    case "beta":
      return process.env.PASS_BETA;
    case "delta":
      return process.env.PASS_DELTA;
  }
}

const PUBLIC_COLUMNS =
  "intro, sponsor_enabled, sponsor_name, sponsor_logo_url, sponsor_link";
const ALL_COLUMNS = `${PUBLIC_COLUMNS}, case_pdf_url, case_pdf_name, case_data_url, case_data_name`;

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

    const { data: row, error } = await supabaseAdmin
      .from("stage_content")
      .select(unlocked ? ALL_COLUMNS : PUBLIC_COLUMNS)
      .eq("stage", data.stage)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { content: row ?? null, unlocked };
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
