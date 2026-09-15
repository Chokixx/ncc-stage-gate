CREATE TABLE public.download_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  stage text NOT NULL,
  kind text NOT NULL,
  full_name text NOT NULL,
  team text NOT NULL,
  email text NOT NULL,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.download_receipts TO service_role;
ALTER TABLE public.download_receipts ENABLE ROW LEVEL SECURITY;
CREATE INDEX download_receipts_email_idx ON public.download_receipts (email);
CREATE INDEX download_receipts_stage_idx ON public.download_receipts (stage);