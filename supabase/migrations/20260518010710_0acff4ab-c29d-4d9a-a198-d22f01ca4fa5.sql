
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mode TEXT NOT NULL CHECK (mode IN ('solo','team')),
  participants JSONB NOT NULL,
  proof_url TEXT,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a registration"
  ON public.registrations FOR INSERT TO anon, authenticated
  WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('registration-proofs', 'registration-proofs', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read registration proofs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'registration-proofs');

CREATE POLICY "Public upload registration proofs"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'registration-proofs');
