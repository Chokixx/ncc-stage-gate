CREATE TABLE public.ncc_registered_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position integer NOT NULL,
  name text NOT NULL,
  members jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ncc_registered_teams TO anon;
GRANT SELECT ON public.ncc_registered_teams TO authenticated;
GRANT ALL ON public.ncc_registered_teams TO service_role;
ALTER TABLE public.ncc_registered_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ncc_registered_teams public read" ON public.ncc_registered_teams FOR SELECT USING (true);
CREATE TRIGGER ncc_registered_teams_touch BEFORE UPDATE ON public.ncc_registered_teams FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();