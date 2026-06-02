ALTER TABLE public.gmat_teams ADD COLUMN IF NOT EXISTS access_token text NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', '');
CREATE UNIQUE INDEX IF NOT EXISTS gmat_teams_access_token_idx ON public.gmat_teams(access_token);
DROP POLICY IF EXISTS "gmat_teams public read" ON public.gmat_teams;
CREATE POLICY "gmat_teams public read names" ON public.gmat_teams FOR SELECT TO public USING (true);
REVOKE SELECT ON public.gmat_teams FROM anon, authenticated;
GRANT SELECT (name, position) ON public.gmat_teams TO anon, authenticated;
GRANT ALL ON public.gmat_teams TO service_role;