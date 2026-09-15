ALTER TABLE public.stage_content
ADD COLUMN IF NOT EXISTS case_data_enabled boolean NOT NULL DEFAULT true;