
-- Sponsors
CREATE TABLE public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier text NOT NULL CHECK (tier IN ('official','strategic','support')),
  position integer NOT NULL,
  name text NOT NULL DEFAULT 'Por anunciar',
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tier, position)
);
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sponsors public read" ON public.sponsors FOR SELECT USING (true);

-- GMAT teams
CREATE TABLE public.gmat_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position integer NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gmat_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gmat_teams public read" ON public.gmat_teams FOR SELECT USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER sponsors_touch BEFORE UPDATE ON public.sponsors
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER gmat_teams_touch BEFORE UPDATE ON public.gmat_teams
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed sponsors
INSERT INTO public.sponsors (tier, position, name) VALUES
  ('official', 1, 'Por anunciar'),
  ('strategic', 1, 'Por anunciar'),
  ('strategic', 2, 'Por anunciar'),
  ('strategic', 3, 'Por anunciar'),
  ('support', 1, 'Por anunciar'),
  ('support', 2, 'Por anunciar'),
  ('support', 3, 'Por anunciar');

-- Seed teams
INSERT INTO public.gmat_teams (position, name)
SELECT i, 'Equipo ' || lpad(i::text, 3, '0')
FROM generate_series(1, 100) AS i;

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('sponsor-logos', 'sponsor-logos', true);
CREATE POLICY "sponsor logos public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'sponsor-logos');
